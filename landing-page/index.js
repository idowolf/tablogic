var express = require('express');

var app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('node_modules/startbootstrap-grayscale'))

app.get('/', function(req,res){
    res.send('hello world')
});

app.listen(PORT, function(err){
    console.log('running server on port ' + PORT)
});