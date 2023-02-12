const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const app = express();
app.use(express.json());

const corsOption = {
    origin: ['http://localhost:5000'],
};
app.use(cors(corsOption));
//if you want in every domain then
app.use(cors())

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authCheck = req.session.authorization;
    if (!authCheck) {
        return res.status(404).json({
            message: "Error logging in"
        }); 
    }
    next()
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));