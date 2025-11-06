import express from 'express'
import cors from 'cors'
import { errorMiddleware } from '@packages/middlewares/errorMiddleware'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import route from './routes/product.routes'
// import swaggerUi from 'swagger-ui-express'
//import bodyparser from 'body'
// const swaggerDocument=require('./swagger-output.json')
dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:4200','http://localhost:4300','http://localhost:3000','http://localhost:5555'],
  allowedHeaders: ['Authorization', 'Content-type'],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send({ 'message': 'Hello API from Product service' });
})

// app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
// app.get('/docs-json',(req,res)=>{
//   res.json(swaggerDocument)
// })

//Routes
app.use('/api',route)

app.use(errorMiddleware)

const port = Number(process.env.PRODUCT_SERVICE_PORT) || 5050

const server = app.listen(port, () => {
  console.log(`product service is running at http://localhost:${port}/api`)
  // console.log(`Swagger docs availible at http://localhost:${port}/docs`)
})

server.on('error', (err)=>{
    console.log(`Error from Auth service :`,err)
});