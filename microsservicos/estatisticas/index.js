const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const estatisticas = {
  totalLembretes: 0,
  lembretesComuns: 0,
  lembretesImportantes: 0,
  totalObservacoes: 0,
  mediaCaracteresObservacao: 0,
};

let somaCaracteresObservacoes = 0;

function processarEvento(type, payload) {
  if (type === 'LembreteCriado') {
    estatisticas.totalLembretes++;
  }

  if (type === 'LembreteClassificado') {
    if (payload.status === 'importante') {
      estatisticas.lembretesImportantes++;
    } else {
      estatisticas.lembretesComuns++;
    }
  }

  if (type === 'ObservacaoCriada') {
    estatisticas.totalObservacoes++;

    const tamanho = payload.texto.length;
    somaCaracteresObservacoes += tamanho;
    estatisticas.mediaCaracteresObservacao =
      somaCaracteresObservacoes / estatisticas.totalObservacoes;
  }
}

app.post('/eventos', (req, res) => {
  const { type, payload } = req.body;
  processarEvento(type, payload);
  res.status(200).send({ msg: 'Evento processado' });
});

app.get('/estatistica', (req, res) => {
  res.json(estatisticas);
});

const port = 9000;
app.listen(port, async () => {
  console.log(`Estatísticas. Porta ${port}.`);

  try {
    const resposta = await axios.get('http://localhost:10000/eventos');
    const eventos = resposta.data;
    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        processarEvento(evento.type, evento.payload);
      }
    }
    console.log('Eventos recuperados com sucesso!');
  } catch (err) {
    console.log('Não foi possível recuperar eventos antigos.');
  }
});

axios.post('http://localhost:10000/registrar', {
  nome: 'estatisticas',
  eventosInteresse: ['LembreteCriado', 'LembreteClassificado', 'ObservacaoCriada']
});

