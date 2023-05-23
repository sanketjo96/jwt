const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

app.use(express.json());
app.use(authToken)
app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true }))

const USER = new Map();
USER.set('admin', { id: 1, username: 'admin', role: 'Admin' })
USER.set('account', { id: 1, username: 'account', role: 'Account' })



app.post("/login", (req, res) => {
    // Authenticate user

    const username = req.body.username
    const user = USER.get(username)
    if (user === null) {
        res.sendStatus(401);
        return;
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken })
});

app.get("/data", (req, res) => {
    res.json(req.user.id)
});

app.listen(3000)