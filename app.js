const express = require('express');
const app = express();
const dotenv = require("dotenv");
const {createProxyMiddleware} = require('http-proxy-middleware')
dotenv.config();
const PORT = process.env.PORT || 8000
const cors = require("cors");


app.use(cors({ origin:'*', credentials: true }));


app.use('/api/v1/project', createProxyMiddleware({
    // target: 'http://project_service:8002/api/v1',
    target: 'http://localhost:8002/api/v1',

    pathRewrite:{
        '^/project':''
    }
}))

app.use('/api/v1/role', createProxyMiddleware({
    // target: 'http://role_service:8003/api/v1',
    target: 'http://localhost:8003/api/v1',

    pathRewrite:{
        '^/role':''
    }
}))
// console.log("came in auth");
app.use('/api/v1/auth/', createProxyMiddleware({
    // target: 'http://auth_service:8001/api/v1'
    target: 'http://localhost:8001/api/v1',

    pathRewrite:{
        '^/auth':''
    },
}))
app.use('/api/v1/schema/', createProxyMiddleware({
    target: 'http://schema_service:8004/api/v1',
    // target: 'http://localhost:8004/api/v1',

    pathRewrite:{
        '^/schema':''
    },
}))


//made minor changes

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})