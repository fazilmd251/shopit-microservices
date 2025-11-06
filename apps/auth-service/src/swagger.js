const swaggerAutogen = require("swagger-autogen");

const doc={
    info:{
        title:"Auth Service API",
        description:"Automatically generated swagger docs",
        version:'1.0.0'
    },
    host:'localhost:4040',
    schemes:['http']
}

const outputFile='./swagger-output.json'
const endpointFiles=['./routes/auth.route.ts']

swaggerAutogen()(outputFile,endpointFiles,doc)