const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const lembretes = {};

const funcoes = {
  LembreteCriado: (payload) => {
    const { id, texto } = payload;
    lembretes[id] = { id, texto, observacoes: [], status: payload.status || 'comum' };
  },

  ObservacaoCriada: (payload) => {
    const { id, texto, lembreteId, status } = payload;
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      lembrete.observacoes.push({ id, texto, status });
    }
  },

  ObservacaoAtualizada: (payload) => {
    const { id, texto, lembreteId, status } = payload;
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      const obs = lembrete.observacoes.find((o) => o.id === id);
      if (obs) {
        obs.texto = texto;
        obs.status = status;
      }
    }
  },

  ObservacaoClassificada: (payload) => {
    const { id, status, lembreteId } = payload;
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      const obs = lembrete.observacoes.find((o) => o.id === id);
      if (obs) {
        obs.status = status;
      }
    }
  },

  LembreteClassificado: (payload) => {
    const { id, status, texto } = payload;
    if (lembretes[id]) {
      lembretes[id].status = status;
      lembretes[id].texto = texto;
    }
  }
};

app.get('/lembretes', (req, res) => {
  res.send(lembretes);
});

app.post('/eventos', (req, res) => {
  try {
    const { type, payload } = req.body;
    if (funcoes[type]) {
      funcoes[type](payload);
    }
  } catch (e) {
    console.log(e.message);
  }
  res.status(200).send({ msg: 'Evento processado' });
});

const port = 6000;
app.listen(port, () => {
  console.log('Consulta. Porta ' + port);
});

(async () => {
  try {
    await axios.post('http://localhost:10000/registrar', {
      nome: 'consulta',
      eventosInteresse: [
        'LembreteCriado',
        'ObservacaoCriada',
        'ObservacaoAtualizada',
        'ObservacaoClassificada', 
        'LembreteClassificado'     
      ]
    });

    const resposta = await axios.get('http://localhost:10000/eventos');
    const eventos = resposta.data;

    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        try {
          funcoes[evento.type](evento.payload);
        } catch (e) {
          console.log('Erro ao reprocesar evento:', e.message);
        }
      }
    }

    console.log('Eventos antigos processados com sucesso.');
  } catch (err) {
    console.log('Falha ao recuperar eventos antigos.');
  }
})();
