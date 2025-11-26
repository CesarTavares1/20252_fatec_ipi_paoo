const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const logs = [];

app.post('/eventos', (req, res) => {
  const { type, payload } = req.body;
  logs.push({ id: uuidv4(), timestamp: new Date().toISOString(), type, payload });
  res.json({ ok: true });
});

app.get('/logs', (req, res) => res.json(logs));

app.listen(8000, async () => {
  console.log('Logs. Porta 8000');

  await axios.post('http://localhost:10000/registrar', {
    nome: 'logs',
    eventosInteresse: ['LembreteCriado', 'LembreteClassificado', 'ObservacaoCriada', 'ObservacaoClassificada', 'ObservacaoAtualizada']
  }).catch(() => {});

  try {
    const { data: eventos } = await axios.get('http://localhost:10000/eventos');
    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        logs.push({ id: uuidv4(), timestamp: new Date().toISOString(), type: evento.type, payload: evento.payload });
      }
    }
  } catch (err) {}
});