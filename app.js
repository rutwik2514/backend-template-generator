const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connect = require("./connect");
const routes = require("./routes/route");
const path = require('path');
// const { Check } = require("./new");

const configPath = path.join('.env');
dotenv.config({path: configPath});

connect(process.env.MONGO_URI);

// Using middlewares
app.use(express.json());
app.use(cors({ origin:'http://localhost:8004', credentials: true }));
app.use("/api/v1", routes);
// Check()

const {worker} = require("./controller/worker")
//Starting server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}.`);
});