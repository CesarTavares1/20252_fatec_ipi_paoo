const express = require('express')
const axios = require('axios')
const app = express()
app.use(express.json())

let id = 0
const lembretes = {}

app.post('/lembretes', async function(req, res){
  id++
  const texto = req.body.texto
  const lembrete = { id, texto }
  lembretes[id] = lembrete
  await axios.post('http://localhost:10000/eventos', {
    type: 'LembreteCriado',
    payload: lembrete
  })
  res.status(201).json(lembrete)
})

app.get('/lembretes', (req, res) => {
  res.json(lembretes)
})

app.post('/eventos', (req, res) => {
  const evento = req.body
  console.log(evento)
  res.end()
})

app.get('/status', (req, res) => {
  res.end()
})

const port = 4000
app.listen(port, () => console.log(`Lembretes. Porta ${port}.`))