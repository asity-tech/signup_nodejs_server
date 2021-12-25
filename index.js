const express = require('express');
const res = require('express/lib/response');
const {Client} = require('pg');
var bodyParser = require('body-parser');
const port = 3000;
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

var client = new Client({
    user: process.env.user || 'postgres',
    host: process.env.host|| 'localhost',
    database: process.env.database || 'asitysignup',
    password: process.env.password || 'blah',
    port: 5432,
})

function removeWhiteSpaceFromEnd(title) {
    var size = title.length;
    while (title[size - 1] == " ") {
      size--;
    }
    var temp = "";
    for (let j = 0; j < size; j++) {
      temp += title[j];
    }
    return temp;
}

app.get('/', (req, res) => {
    res.send("welcome to the magic world -> Asity");
})

app.post('/signup', (req, res) => {
    var rawEmail = req.body.Email
    var emailid = removeWhiteSpaceFromEnd(rawEmail);
    var rawPasscode = req.body.Password
    var passcode = removeWhiteSpaceFromEnd(rawPasscode);
    const insertquery = `insert into accounts(email, password) values('${emailid}', '${passcode}')`;
    client.query(insertquery, (err, result) => {
        if(err){
            res.send(err.message || err);
        }
        else{
            res.status(201);
            console.log('Db insertion successful');
            res.send(result);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    client.connect((err) => {
        if(err){
           throw err;
        }
        console.log("Database connection: Successful");
    });
    
})