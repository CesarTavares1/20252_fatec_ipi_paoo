const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const observacoesPorLembrete = {};

app.post('/lembretes/:id/observacoes', (req, res) => {
  const { id: lembreteId } = req.params;
  const observacao = { id: uuidv4(), texto: req.body.texto, lembreteId, status: 'aguardando' };
  const obs = observacoesPorLembrete[lembreteId] = observacoesPorLembrete[lembreteId] || [];
  obs.push(observacao);
  axios.post('http://localhost:10000/eventos', { type: 'ObservacaoCriada', payload: observacao }).catch(() => {});
  res.json(obs);
});

app.get('/lembretes/:id/observacoes', (req, res) => res.json(observacoesPorLembrete[req.params.id] || []));

app.post('/eventos', (req, res) => {
  const { type, payload } = req.body;
  if (type === 'ObservacaoClassificada') {
    const obs = observacoesPorLembrete[payload.lembreteId]?.find(o => o.id === payload.id);
    if (obs) {
      obs.status = payload.status;
      axios.post('http://localhost:10000/eventos', { type: 'ObservacaoAtualizada', payload }).catch(() => {});
    }
  }
  res.end();
});

app.listen(5000, () => {
  console.log('Observações. Porta 5000');
  axios.post('http://localhost:10000/registrar', { nome: 'observacoes', eventosInteresse: ['ObservacaoClassificada'] }).catch(() => {});
});

