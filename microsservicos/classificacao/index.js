import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const palavraChave = 'importante';

const funcoes = {
  ObservacaoCriada: async (observacao) => {
    const textoLower = observacao.texto.toLowerCase();

    if (textoLower.includes(palavraChave)) {
      observacao.status = 'importante';
    } else {
      observacao.status = 'comum';
    }

    await axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: observacao
    }).catch(() => {});
  },

  LembreteCriado: async (lembrete) => {
    if (lembrete.texto.length >= 50) {
      lembrete.status = 'importante';
    } else {
      lembrete.status = 'comum';
    }

    await axios.post('http://localhost:10000/eventos', {
      type: 'LembreteClassificado',
      payload: lembrete
    }).catch(() => {});
  }
};

app.post('/eventos', async (req, res) => {
  const evento = req.body;
  console.log('Evento recebido na Classificação:', evento);

  try {
    const funcao = funcoes[evento.type];
    if (funcao) {
      await funcao(evento.payload);
    }
  } catch (e) {
    console.log('Erro ao processar evento:', e.message);
  }

  res.end();
});

const port = 7000;
app.listen(port, async () => {
  console.log(`Classificação. Porta ${port}.`);

  await axios.post('http://localhost:10000/registrar', {
    nome: 'classificacao',
    eventosInteresse: ['ObservacaoCriada', 'LembreteCriado']
  }).catch(() => {});
});
