const express = require('express')
const cors = require('cors');

const port = 4000


const app = express()

app.use(cors());
app.use(express.json());


const pass = "arabian18";


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian:arabian18@cluster0.eaaai.mongodb.net/burjAlArab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookings = client.db("burjAlArab").collection("bookings");
  

  
  app.post('/addBooking', (req, res) => {
    const newBooking = req.body;
    console.log(newBooking);
    bookings.insertOne(newBooking)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        console.log(newBooking);  
})

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)