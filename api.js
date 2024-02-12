const express = require('express');
const path = require("path");

const api = express();

api.use(express.static(path.join(__dirname, "public")));

api.use('/', express.static('index.html'));

// below listen is only needed if we are not using the server.js file and passing api in createServer
/*
api.listen(8000, () => {
    console.log('Server is running on port 3000');
});
*/

module.exports = api;