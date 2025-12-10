import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

const eventos = []

app.post('/eventos', async (req, res) => {
  const evento = req.body
  eventos.push(evento)
  console.log(evento)
  try{
    await axios.post('http://localhost:4000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:5000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:6000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:7000/eventos', evento)
  }
  catch(e){}
  res.end()
})

app.get('/verificar', async (req, res) => {
  
  const itens = ["validos: "]

  try{
    await axios.get('http://localhost:4000/status')
    const retorno= 'lembretes'
    itens.push(retorno)
  }
  catch(e){}

  try{
    await axios.get('http://localhost:5000/status')
    const retorno = 'observacoes'
    itens.push(retorno)
  }
  catch(e){}

  try{
    await axios.get('http://localhost:6000/status')
    const retorno = 'consulta'
    itens.push(retorno)
  }
  catch(e){}

  try{
    await axios.get('http://localhost:7000/status')
    const retorno = 'classifcacao'
    itens.push(retorno)
  }
  catch(e){}

  res.send(itens)

})

app.get('/eventos', (req, res) => {
  res.json(eventos)
})


const port = 10000
app.listen(port, () => {
  console.log(`Barramento. Porta ${port}.`)
})