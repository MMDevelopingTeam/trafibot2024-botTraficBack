const express = require("express")
const initDB = require('./config/db')
const cors = require("cors")
const bodyParser = require('body-parser');
const { Server } = require('./classes/server');
const server = Server.instance;
// const cache = require('express-expeditious')({
//     namespace: 'expresscache',
//     defaultTtl: '10 minute',
//     statusCodeExpires: {
//       404: '5minutes',
//       500: 0
//     }
// })

// server.app.use(cache);
server.app.use(cors({ origin: true, credentials: true }));
server.app.use(express.json({limit: '50mb'}));
server.app.use(
    bodyParser.json({limit: '100mb'})
);
server.app.use(
    bodyParser.urlencoded({limit: '100mb', extended: true})
);

server.app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
})

//Rutas
server.app.use("/api", require("./routes"));

initDB();

server.start(() => {
    console.log(`App lista por http://localhost:${server.port}`);
});