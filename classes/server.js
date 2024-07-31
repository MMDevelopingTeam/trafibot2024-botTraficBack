const express = require("express")
const socketIO = require("socket.io");
require("dotenv").config();
const http = require("http");
const { desconectar, mensaje, configUsuario, conectarCliente } = require("../sockets/socket");
const socketsModels = require('../models/sockets');

class Server {
    static _instance;
    app;
    port;
    io;
    httpServer;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3020;
        this.httpServer = new http.Server(this.app)
        this.io = socketIO( this. httpServer, {
            cors: {
                origin: true,
                credentials: true,
                methods: ["GET", "POST"]
            }
        })
        this.clieanSocketsDB();
        this.listenSockets();
    }

    static get instance() {
        return this._instance || ( this._instance = new Server() )
    }

    listenSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {
            console.log("cliente conectado");

            // conectar cliente
            conectarCliente(cliente);
            // desconectar
            desconectar(cliente);
            // mensaje
            mensaje(cliente, this.io);
            // configurar usuario
            configUsuario(cliente);
        })
    }

    async clieanSocketsDB() {
        // limpiar db
        await socketsModels.deleteMany()
    }

    start(callback) {
        this.httpServer.listen( this.port, callback );
    }
}

module.exports = { Server };