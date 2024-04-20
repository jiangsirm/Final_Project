const express = require("express");
const mongoose = require('mongoose');
const password = require('./backend/password.api.cjs')
const account = require('./backend/account.api.cjs')
const path = require('path')
const cookieParser = require('cookie-parser')

// const path = require('path');

const app = express();

const mongoDBEndpoint = 'mongodb+srv://cs5610:webdev@firstcluster.u1o1hyw.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster'
mongoose.connect(mongoDBEndpoint, {
    dbName: "webSpr24",
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/password', password);
app.use('/api/account', account);

let frontend_dir = path.join(__dirname, 'dist')

app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.listen(process.env.PORT || 8000, function(){
    console.log("deep dark fantasy");
});