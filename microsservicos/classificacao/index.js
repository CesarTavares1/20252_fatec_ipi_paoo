import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const handlers = {
  ObservacaoCriada: async ({ id, texto, lembreteId, status }) => {
    const novoStatus = texto.toLowerCase().includes('importante') ? 'importante' : 'comum';
    await axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: { id, texto, lembreteId, status: novoStatus }
    }).catch(() => {});
  },

  LembreteCriado: async ({ id, texto }) => {
    const novoStatus = texto.length >= 50 ? 'importante' : 'comum';
    await axios.post('http://localhost:10000/eventos', {
      type: 'LembreteClassificado',
      payload: { id, texto, status: novoStatus }
    }).catch(() => {});
  }
};

app.post('/eventos', async (req, res) => {
  const { type, payload } = req.body;
  if (handlers[type]) {
    await handlers[type](payload);
  }
  res.end();
});

app.listen(7000, async () => {
  console.log('Classificação. Porta 7000');

  await axios.post('http://localhost:10000/registrar', {
    nome: 'classificacao',
    eventosInteresse: ['ObservacaoCriada', 'LembreteCriado']
  }).catch(() => {});

  try {
    const { data: eventos } = await axios.get('http://localhost:10000/eventos');
    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        if (handlers[evento.type]) {
          await handlers[evento.type](evento.payload);
        }
      }
    }
  } catch (err) {}
});