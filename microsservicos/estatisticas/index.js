const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const stats = {
  totalLembretes: 0,
  lembretesComuns: 0,
  lembretesImportantes: 0,
  totalObservacoes: 0,
  mediaCaracteresObservacao: 0,
};

let somaCaracteres = 0;

const processar = (type, payload) => {
  if (type === 'LembreteCriado') stats.totalLembretes++;
  if (type === 'LembreteClassificado') {
    payload.status === 'importante' ? stats.lembretesImportantes++ : stats.lembretesComuns++;
  }
  if (type === 'ObservacaoCriada') {
    stats.totalObservacoes++;
    somaCaracteres += payload.texto.length;
    stats.mediaCaracteresObservacao = somaCaracteres / stats.totalObservacoes;
  }
};

app.post('/eventos', (req, res) => {
  processar(req.body.type, req.body.payload);
  res.json({ ok: true });
});

app.get('/estatistica', (req, res) => res.json(stats));

app.listen(9000, async () => {
  console.log('Estatísticas. Porta 9000');

  await axios.post('http://localhost:10000/registrar', {
    nome: 'estatisticas',
    eventosInteresse: ['LembreteCriado', 'LembreteClassificado', 'ObservacaoCriada']
  }).catch(() => {});

  try {
    const { data: eventos } = await axios.get('http://localhost:10000/eventos');
    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        processar(evento.type, evento.payload);
      }
    }
  } catch (err) {}
});