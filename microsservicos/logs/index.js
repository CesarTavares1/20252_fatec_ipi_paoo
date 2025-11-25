const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const logs = [];

function registrarLog(type, payload) {
  logs.push({
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    type,
    payload,
  });
}

app.post('/eventos', (req, res) => {
  const { type, payload } = req.body;
  registrarLog(type, payload);
  res.status(200).send({ msg: 'Log registrado' });
});

app.get('/logs', (req, res) => {
  res.json(logs);
});

const port = 8000;
app.listen(port, async () => {
  console.log(`Logs. Porta ${port}.`);

  try {
    const resposta = await axios.get('http://localhost:10000/eventos');
    resposta.data.forEach((evento) =>
      registrarLog(evento.type, evento.payload)
    );
    console.log('Eventos antigos levados para o log!');
  } catch (err) {
    console.log('Não foi possivel trazer eventos antigos para o log!');
  }
});

