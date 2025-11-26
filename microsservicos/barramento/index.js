const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const eventos = {};
const interesses = {};
const portas = { lembretes: 4000, observacoes: 5000, consulta: 6000, classificacao: 7000, logs: 8000, estatisticas: 9000 };

app.post('/registrar', async (req, res) => {
  const { nome, eventosInteresse = [] } = req.body;
  interesses[nome] = eventosInteresse;

  for (const tipo of eventosInteresse) {
    if (eventos[tipo]) {
      for (const ev of eventos[tipo]) {
        axios.post(`http://localhost:${portas[nome]}/eventos`, ev).catch(() => {});
      }
    }
  }

  res.json({ ok: true });
});

app.post('/eventos', async (req, res) => {
  const evento = req.body;
  if (!eventos[evento.type]) {
    eventos[evento.type] = [];
  }
  eventos[evento.type].push(evento);

  for (const [nome, types] of Object.entries(interesses)) {
    if (types.includes(evento.type)) {
      axios.post(`http://localhost:${portas[nome]}/eventos`, evento).catch(() => {});
    }
  }

  res.end();
});

app.get('/eventos', (req, res) => res.json(eventos));

app.listen(10000, () => console.log('Barramento. Porta 10000'));