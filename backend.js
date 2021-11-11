var express = require("express");
const bodyParser = require("body-parser");
var app = express();
const port = 8000;

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://18stucddn01023:12345670@cluster0.907m2.mongodb.net/RegistrationForm?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post("/send", (req, res) => {
    const { firstName, lastName, email } = req.body;
    return client.connect(err => {
        if(err) {
            return res.send({ err });
        }

        const collection = client.db("Records").collection("Data");

        return collection.insertOne({ email: email, firstName: firstName, lastName: lastName })
        .then(() => {
            client.close();
            return res.send({ msg: 'Succesfully sent' });
        })
        .catch((err) => {
            client.close();
            console.log( err);
            return res.send({ err });
        });
    });
});
 
app.listen(port, () => {
  console.log(`Server started on : ${port}`);
});