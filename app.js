const express = require("express");
const cors = require("cors");
const http = require("http");
const { connectIO } = require("./io");

const app = express();
app.use(cors());

const server = http.createServer(app);

connectIO(server);

const port = process.env.PORT || 3200;

server.listen(port, () => {
  console.log("Chat server running on port", port);
});
