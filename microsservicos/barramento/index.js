const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const eventos = {};
const interesses = {};

const portas = {
  lembretes: 4000,
  observacoes: 5000,
  consulta: 6000,
  classificacao: 7000,
  logs: 8000,
  estatisticas: 9000
};

app.post('/registrar', async (req, res) => {
  const { nome, eventosInteresse } = req.body || {};

  if (eventosInteresse) {
    interesses[nome] = eventosInteresse;
  } else {
    interesses[nome] = [];
  }

  console.log(`Microsserviço '${nome}' registrado com interesse em:`, interesses[nome]);

  for (const tipo of interesses[nome]) {
    if (eventos[tipo]) {
      for (const ev of eventos[tipo]) {
        const targetPort = portas[nome];
        if (!targetPort) {
          console.warn(`Porta desconhecida para microsserviço '${nome}', pulando envio de eventos antigos.`);
          continue;
        }
        axios.post(`http://localhost:${targetPort}/eventos`, ev).catch((err) => {
          console.log(`Falha ao enviar evento antigo para ${nome} na porta ${targetPort}:`, err.message);
        });
      }
    }
  }

  res.status(200).send({ status: 'Interesses registrados com sucesso' });
});

app.post('/eventos', async (req, res) => {
  const evento = req.body;
  console.log('\nEvento recebido no barramento:', evento);

  if (!eventos[evento.type]) {
    eventos[evento.type] = [];
  }
  eventos[evento.type].push(evento);

  for (let nome in interesses) {
    if (interesses[nome].includes(evento.type)) {
      try {
        await axios.post(`http://localhost:${portas[nome]}/eventos`, evento);
        console.log(`Evento enviado para: ${nome}`);
      } catch (e) {
        console.log(`Falha ao enviar evento para ${nome}`);
      }
    }
  }

  res.end();
});

app.get('/eventos', (req, res) => {
  res.json(eventos);
});

const port = 10000;
app.listen(port, () => {
  console.log(`Barramento de eventos. Porta ${port}.`);
});
