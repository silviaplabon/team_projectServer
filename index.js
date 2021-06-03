const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

const admin = require('firebase-admin');
const port = process.env.PORT || 4300;
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const ApartmentsCollection = client.db('ApartmentsService').collection("Apartments");
  const BookingsCollection = client.db('ApartmentsService').collection("Bookings");
  app.post('/addApartment', (req, res) => {
    const newApartment = req.body;
    ApartmentsCollection.insertOne(newApartment)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.get('/apartmentData', (req, res) => {
    ApartmentsCollection.find({}).toArray((err, apartments) => {
      res.send(apartments)
    })
  })

  //   finding specific single apartment data
  app.get('/apartmentSpecificData/:id', (req, res) => {
    ApartmentsCollection.findOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        res.send(result)
      })
  })

  app.get('/adminBookingsCollection', (req, res) => {
    BookingsCollection.find({})
      .toArray((err, products) => {
        res.send(products)
      })
  })
  app.post('/bookApartment', (req, res) => {
    const bookApartment = req.body;
    BookingsCollection.insertOne(bookApartment)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})