import express from 'express'
import axios from 'axios'
const app = express()

app.use(express.json())
const palavraChave = 'importante'
const funcoes = {
  ObservacaoCriada: (observacao) => {
    if(observacao.texto.includes(palavraChave))
      observacao.status = 'importante'
    else
      observacao.status = 'comum'
    axios.post('http://localhost:10000/eventos', {
      type: 'ObservacaoClassificada',
      payload: observacao
    })
  }
}

app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){}
  res.end()
})

app.get('/status', (req, res) => {
  res.end()
})

const port = 7000
app.listen(port, () => {
  console.log(`Classificação. Porta ${port}.`)
  axios.get('http://localhost:10000/eventos').then(({data: eventos}) => {
    for(let evento of eventos){
      try{
        funcoes[evento.type](evento.payload)
      }
      catch(e){}
    }
  })
})
