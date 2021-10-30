const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjk3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travelsTourism");
        const servicesCollect = database.collection("services");

        //get all
        app.get('/services', async (req, res) => {
            const cursor = servicesCollect.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('jsjfj', id)
            const query = { _id: ObjectId(id) }
            const service = await servicesCollect.findOne(query)
            res.json(service)
        })

        // app post
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log('hit the post', service)
            // res.send('hitted')

            const result = await servicesCollect.insertOne(service);
            console.log(result)
            res.json(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running server')
});

app.listen(port, () => {
    console.log('Running server', port)
})