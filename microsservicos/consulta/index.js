const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const lembretes = {};

const handlers = {
  LembreteCriado: ({ id, texto }) => {
    if (lembretes[id]) {
      lembretes[id].texto = texto;
    } else {
      lembretes[id] = { id, texto, observacoes: [], status: 'comum' };
    }
  },

  LembreteClassificado: ({ id, status, texto }) => {
    if (!lembretes[id]) {
      lembretes[id] = { id, texto, observacoes: [], status };
    } else {
      lembretes[id].status = status;
      lembretes[id].texto = texto;
    }
  },

  ObservacaoCriada: ({ id, texto, lembreteId, status }) => {
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      const existingObs = lembrete.observacoes.find(o => o.id === id);
      if (existingObs) {
        existingObs.texto = texto;
      } else {
        lembrete.observacoes.push({ id, texto, status });
      }
    }
  },

  ObservacaoClassificada: ({ id, status, lembreteId, texto }) => {
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      const obs = lembrete.observacoes.find(o => o.id === id);
      if (obs) {
        obs.status = status;
      } else {
        lembrete.observacoes.push({ id, texto, status });
      }
    }
  },

  ObservacaoAtualizada: ({ id, texto, lembreteId, status }) => {
    const lembrete = lembretes[lembreteId];
    if (lembrete) {
      const obs = lembrete.observacoes.find(o => o.id === id);
      if (obs) {
        obs.texto = texto;
        obs.status = status;
      }
    }
  }
};

app.get('/lembretes', (req, res) => res.json(lembretes));

app.post('/eventos', (req, res) => {
  const { type, payload } = req.body;
  if (handlers[type]) {
    handlers[type](payload);
  }
  res.json({ ok: true });
});

app.listen(6000, () => console.log('Consulta. Porta 6000'));

(async () => {
  try {
    await axios.post('http://localhost:10000/registrar', {
      nome: 'consulta',
      eventosInteresse: ['LembreteCriado', 'ObservacaoCriada', 'ObservacaoAtualizada', 'ObservacaoClassificada', 'LembreteClassificado']
    });

    const { data: eventos } = await axios.get('http://localhost:10000/eventos');
    for (const tipo in eventos) {
      for (const evento of eventos[tipo]) {
        if (handlers[evento.type]) {
          handlers[evento.type](evento.payload);
        }
      }
    }
  } catch (err) {
    console.log('Erro ao recuperar eventos antigos.');
  }
})();