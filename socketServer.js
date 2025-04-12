require("dotenv").config();
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');


const server = http.createServer({});


// const server = http.createServer({
//     cert: fs.readFileSync('/etc/letsencrypt/live/socketserver1.doctorondoor.com/fullchain.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/live/socketserver1.doctorondoor.com/privkey.pem')
// });

const serverWs = new WebSocket.Server({
    server
});

let sockets = [];
serverWs.on('connection', (socket, request) => {
    // Get headers from the initial HTTP request
    // -------------------- storing data ----------------
    const clientData = JSON.parse(request.headers.cookie);
    sockets.push({ clientData, socket });

    function searchNestedArray(array, property, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].clientData && array[i].clientData[property] === value) {
                return i;
            }
        }
        return false;
    }


    let result = searchNestedArray(sockets, '_id', clientData._id);
    if (result) {
        sockets[result] = { clientData, socket };
    } else {
        sockets.push({ clientData, socket });
    }
    // -------------------- storing data ----------------


    // When you receive a message, send that message to every socket.
    socket.on('message', function (msg) {
        const receivedDataStr = msg.toString();
        const receivedData = JSON.parse(receivedDataStr);
        const user = receivedData.user;
        const messageData = receivedData.messageData;

        if (user.length === 0) {
            sockets.forEach(s => s.socket.send(JSON.stringify(messageData)));
        } else {
            const filteredSockets = sockets.filter((s) => {
                if (user.includes(`${s.clientData.mobileNumber}`) || user.includes(`${s.clientData._id}`)) {
                    return true
                } else if (user.includes(`${s.clientData.doctor_id}`)) {
                    return true;
                } else {
                    return false;
                }
            });
            filteredSockets.forEach(s => s.socket.send(JSON.stringify(messageData)));
        }
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function () {
        sockets = sockets.filter(s => s.socket !== socket);
    });
});

server.listen(process.env.SOCKETPORT,'0.0.0.0',  () => {
    console.log(`Server running on port ${process.env.SOCKETPORT}`);
});