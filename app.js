const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const configPath = path.join('.env');

dotenv.config({path: configPath});
app.use(express.json());
app.use(cors({ origin:'http://localhost:8004', credentials: true }));

const {worker} = require("./controllers/worker")
//Starting server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}.`);
});