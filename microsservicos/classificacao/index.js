//fazer os imports
import express from 'express'
import axios from 'axios'
const app = express()
//aplicar eventuais middlewares
app.use(express.json())
//colocar o mss para funcionar na porta 7000
const port = 7000
app.listen(port, () => console.log(`Classificação. Porta ${port}.`))
