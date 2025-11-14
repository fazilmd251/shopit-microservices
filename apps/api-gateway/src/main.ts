import express from 'express';
import * as path from 'path';
//import cookieParser from 'cookie-parser';
import cors from 'cors'
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
//import swaggerUi from 'swagger-ui-express'
//import axios from 'axios';
import dotenv from 'dotenv'
import initializeConfig from './libs/initializeSiteConfig';
dotenv.config()

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
}))




app.use(morgan("dev"))
app.use(express.json({ limit: "70mb" }))
app.use(express.urlencoded({ limit: "70mb", extended: true }))
app.set("trust proxy", 1)

//apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 300 : 50),
  message: { error: "Too many requests , please try again later" },
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req: any) => req.ip
})

app.use(limiter)

app.use('/product', proxy(`http://localhost:${process.env.PRODUCT_SERVICE_PORT || 5050}`))
app.use('/', proxy(`http://localhost:${process.env.AUTH_PORT || 4040}`))


app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' })
});

const port = process.env.GATE_WAY_PORT || 5555;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}/api`);
  try {
     initializeConfig()
    console.log("site config initialised succesfully ")
  } catch (error) {
    console.log("site config error from app listener")
  }
});
server.on('error', console.error)

