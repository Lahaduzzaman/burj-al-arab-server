const express = require('express')
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eaaai.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
const port = 4000


const app = express()

app.use(cors());
app.use(express.json());


var serviceAccount = require("./configs/burj-al-arab-a9733-firebase-adminsdk-82omh-1c8bef9e0d.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("burjAlArab").collection("bookings");


    app.post('/addBooking', (req, res) => {
        const newBooking = req.body;
        bookings.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })

    })

    app.get('/bookings', (req, res) => {
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            admin.auth().verifyIdToken(idToken)
                .then(function (decodedToken) {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    if (tokenEmail == queryEmail) {
                        bookings.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents);
                            })
                    }
                    else {
                        res.status(401).send('un-authorized access')
                    }
                })
                .catch(function (error) {
                    res.status(401).send('un-authorized access')
                });
        }
        else {
            res.status(401).send('un-authorized access')
        }
    })
});

app.listen(port)