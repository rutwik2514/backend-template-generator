require('dotenv').config()

const express = require('express')
const app = express()
const cors = require("cors");
const connect  = require('./connect');
const routes = require("./routes/route");


const PORT = process.env.PORT || 8001

connect(process.env.MONGO_URI);

app.use(express.json())
app.use(cors())
app.use("/api/v1", routes);

app.get('/', (req, res) => {
    return res.json({ message: "we are running" })
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
