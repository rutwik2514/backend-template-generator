require('dotenv').config()

const express = require('express')
const app = express()
const cors = require("cors");
const  connect  = require('./connect');
const routes = require("./routes/route");


const PORT = process.env.PORT || 8003

connect(process.env.MONGO_URI);

app.use(express.json())
app.use(cors())
app.use("/api/v1", routes);

app.listen(PORT, () => {
    console.log(`Roles server is running on ${PORT}`);
})
