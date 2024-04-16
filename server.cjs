const express = require("express");
const mongoose = require('mongoose');
const password = require('./backend/password.api.cjs')
const account = require('./backend/account.api.cjs')

// const path = require('path');

const app = express();

const mongoDBEndpoint = 'mongodb+srv://cs5610:webdev@firstcluster.u1o1hyw.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster'
mongoose.connect(mongoDBEndpoint, {
    dbName: "webSpr24",
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/password', password);
app.use('/api/account', account);


// Get the absolute path to the root folder
// const rootDir = path.resolve(__dirname);


// app.get('*', function (req, res) {
//     console.log("received request");
//     res.sendFile('index.html', { root: rootDir });
// });

app.get('/', function(request, response){
    response.send("Paqiuli Go!")
});

app.put("/", function(request, response) {
    response.send("Put on your boots!")
    }
)

app.listen(process.env.PORT || 8000, function(){
    console.log("deep dark fantasy");
});