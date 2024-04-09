const express = require("express");

const app = express();

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