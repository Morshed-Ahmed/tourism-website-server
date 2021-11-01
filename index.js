

const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjk3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        /* const database = client.db('travelsTourism');
        const servicesCollect = database.collection('services');
        const database = client.db('travelsTourism');
        const orderCollect = database.collection('order');
        const database = client.db('travelsTourism');
        const allOrderCollect = database.collection('allOrder'); */

        const servicesCollect = client.db("travelsTourism").collection("services");
        const orderCollect = client
            .db("travelsTourism")
            .collection("order");
        /*    const allOrderCollect = client.db("travelsTourism").collection("allOrder"); */


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const service = await servicesCollect.findOne(query)
            res.json(service)
        })

        //get post
        app.get('/services', async (req, res) => {
            const cursor = servicesCollect.find({})
            const services = await cursor.toArray();
            res.send(services)
        })


        //post api
        app.post('/services', async (req, res) => {

            const service = req.body
            console.log('hit the post api', service)
            const result = await servicesCollect.insertOne(service);

            console.log(result)
            res.send(result)
        })

        //add order
        app.post('/addOrder', async (req, res) => {
            console.log(req.body)
            const result = await orderCollect.insertOne(req.body)
            res.json(result)
            /* .then((result) => {
                res.send(result)
            }) */
        })

        // my orders
        app.get('/myOrders/:email', async (req, res) => {
            console.log(req.params.email)

            const result = await orderCollect.find({ email: req.params.email }).toArray();
            res.json(result)

        })

        // delete api
        /*  app.delete('/myOrders/:id', async (req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id) };
             const result = await orderCollect.deleteOne(query);
             console.log('deleted ghh', result)
             res.json(result)


             
             
         }) */
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollect.deleteOne(query);
            console.log('delete order', result)
            res.json(1)
        })

        /* const query = { _id: ObjectId(id) }
            const result = await orderCollect.deleteOne(query)
            res.json(result) */

        // all order
        app.post('/allOrder', async (req, res) => {
            console.log(req.body)
            const result = await allOrderCollect.insertMany(req.body);
            console.log(result)
        })


    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/hello', (req, res) => {
    res.send('hello bangladesh')
})

app.listen(port, () => {
    console.log('start server', port)
})
