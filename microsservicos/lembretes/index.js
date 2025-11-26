const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let id = 0;
const lembretes = {};

app.post('/lembretes', async (req, res) => {
  const lembrete = { id: ++id, texto: req.body.texto };
  lembretes[id] = lembrete;
  await axios.post('http://localhost:10000/eventos', { type: 'LembreteCriado', payload: lembrete }).catch(() => {});
  res.json(lembrete);
});

app.get('/lembretes', (req, res) => res.json(lembretes));

app.post('/eventos', (req, res) => res.end());

app.listen(4000, () => {
  console.log('Lembretes. Porta 4000');
  axios.post('http://localhost:10000/registrar', { nome: 'lembretes', eventosInteresse: [] }).catch(() => {});
});