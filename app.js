const express = require('express');
const router = require('./routes/myRouter');
const app = express();

// fix error CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router, express.static("public"));

const io = require('socket.io')({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
        rejectUnauthorized: true
    }
});

const SERVER_CLIENTS = {};
var sessions = {};

io.on('connection', socket => {
    socket.on("source", checkpoint => {
        // console.log("create socket session: " + checkpoint);
        // session_id = uuidv4();
        var image_number = Math.floor((Math.random()*10)+1);
        session_id = checkpoint;
        session_profile = image_number;
        console.log("session",session_id);
        console.log("create socket session: " + session_id);
        console.log("Profile sesion : " +session_profile);
        if (!SERVER_CLIENTS[session_id]) {
            SERVER_CLIENTS[session_id] = socket.point = session_id;
            SERVER_CLIENTS[session_profile] = socket.profile = session_profile;
            sessions[session_id] = socket;
            sessions[session_profile] = socket;
            // io.local.emit('checkpoint', "server connected : " + session_id);
            io.local.emit('checkpoint', {
                id : session_id,
                profile : session_profile,
                message : "Server connected"
            });
        }
    });

    socket.on("message", message => {
        console.log(message);
        // io.local.emit("show_message", socket.point+" "+message);
        io.local.emit("show_message", {
            id : socket.point,
            profile: socket.profile, 
            message : message
        });
    })

    socket.on("my_message", message => {
        console.log(message);
        io.local.emit("show_my_message", {
            id : socket.point,
            profile: socket.profile,
            message : message
        });
    })

    socket.on("disconnect", () => {
        io.local.emit('checkout', {
            id : session_id,
            message : "Server disconnected"
        });
        if (!socket.point) return;
        console.log("delete socket session: " + socket.point);
        delete SERVER_CLIENTS[socket.point];
    });
});

app.listen(80);
io.listen(7103);