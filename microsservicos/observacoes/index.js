const axios = require('axios')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
app.use(express.json())

const observacoesPorLembrete = {}
const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = observacoesPorLembrete[observacao.lembreteId]
    const obsParaAtualizar = observacoes.find(o => o.id === observacao.id)
    obsParaAtualizar.status = observacao.status
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoAtualizada',
      payload: observacao
    })
  }
}

app.post('/lembretes/:id/observacoes', (req, res) => {
  const idObs = uuidv4()
  const { texto } = req.body
  const { id: lembreteId } = req.params
  const observacao = { id: idObs, texto, lembreteId, status: 'aguardando' }
  const observacoesDoLembrete = observacoesPorLembrete[lembreteId] || []
  observacoesDoLembrete.push(observacao)
  observacoesPorLembrete[lembreteId] = observacoesDoLembrete
  axios.post('http://localhost:10000/eventos', {
    type: 'ObservacaoCriada',
    payload: observacao
  })
  res.status(201).json(observacoesDoLembrete)
})

app.get('/lembretes/:id/observacoes', (req, res) => {
  res.status(200).json(observacoesPorLembrete[req.params.id] || [])
})

app.get('/status', (req, res) => {
  res.end()
})

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){
  }
  res.end()
})

const port = 5000
app.listen(port, () => console.log(`Observações. Porta ${port}.`))


