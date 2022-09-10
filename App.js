import express from 'express'
import router from './settings/router.js'
import {} from "./settings/db.js";

const url = express.urlencoded({extended:true})
const PORT = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use('/api',url, router)

app.listen(PORT, () => {
    console.log(`Сервер запущен! Порт: ${PORT}`)
})

