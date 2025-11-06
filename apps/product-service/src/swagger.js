const swaggerAutogen = require("swagger-autogen");

const doc={
    info:{
        title:"Product  Service API",
        description:"Automatically generated swagger docs",
        version:'1.0.0'
    },
    host:'localhost:6666',
    schemes:['http']
}

const outputFile='./swagger-output.json'
const endpointFiles=['./routes/product.routes.ts']

swaggerAutogen()(outputFile,endpointFiles,doc)