const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const server = express();
server.use(express.json());
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

const userRoute = require("./routes/auth.route");
server.use("/user", userRoute);
