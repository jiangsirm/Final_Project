const express = require("express");
const mongoose = require('mongoose');

const app = express();

const mongoDBEndpoint = 'mongodb+srv://cs5610:<password>@firstcluster.u1o1hyw.mongodb.net/?retryWrites=true&w=majority&appName=FirstCluster'
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function(request, response){
    response.send("Paqiuli Go!")
});

app.put("/", function(request, response) {
    response.send("Put on your boots!")
    }
)

app.listen(8000, function(){
    console.log("deep dark fantasy");
});