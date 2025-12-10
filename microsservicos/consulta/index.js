const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const baseConsolidada = {}

const funcoes = {
  LembreteCriado: (lembrete) => {
    baseConsolidada[lembrete.id] = lembrete
  },
  ObservacaoCriada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
    observacoes.push(observacao)
    baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
  },
  ObservacaoAtualizada: (observacao) => {
    const observacoes = baseConsolidada[observacao.lembreteId]['observacoes']
    const indice = observacoes.findIndex(o => o.id === observacao.id)
    observacoes[indice] = observacao
  }
}

app.get('/lembretes', (req, res) => {
  res.json(baseConsolidada)  
})

app.get('/status', (req, res) => {
  res.end()
})

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    const { type, payload } = evento
    funcoes[type](payload)
  }
  catch(e){}
  res.end()
})

const port = 6000
app.listen(port, async () => { 
  console.log (`Consulta. Porta ${port}.`)
  const resp = await axios.get('http://localhost:10000/eventos')
  for (let evento of resp.data){
      try{
        funcoes[evento.type](evento.payload)
      }
      catch(e){}
  }
})