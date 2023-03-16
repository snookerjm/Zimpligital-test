const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin1:admin1@cluster0.lvnplbg.mongodb.net/?retryWrites=true&w=majority";

app.post('/showData/create', async(req, res) => {
    try {
        const date = new Date().toLocaleString();
        const showData = req.body;
        showData.datestamp = date;
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('myDBZ').collection('showData').insertOne({
            // showname is unique
            showname: showData.showname,
            showimage: showData.showimage,
            price: showData.price,
            tickets: showData.tickets,
            showdate: showData.showdate,
            place: showData.place,
            datestamp: date
        });
        await client.close();
        res.status(200).send({
            "status": "ok",
            "showData": showData
        });
    } catch (error) {
        res.status(400).send(`message: ${ error}`);
    }
})
app.get('/showData', async(req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const showData = await client.db('myDBZ').collection('showData').find({}).toArray();
        await client.close();
        res.status(200).send(showData);
    }catch (error) {
        res.status(400).send(`message: ${ error }`);
    }
})
app.get('/showData/:showname', async(req, res) => {
    try {
        const showname = req.params.showname;
        const client = new MongoClient(uri);
        await client.connect();
        const showData = await client.db('myDBZ').collection('showData').findOne({"showname": showname});
        await client.close();
        res.status(200).send({
        "status": "ok",
        "showData": showData
        });
    }catch (error) {
        res.status(400).send(`message: ${ error }`);
    }
})
app.put('/showData/update', async(req, res) => {
    try {
        const date = new Date().toLocaleString();
        const showData = req.body;
        const showname = showData.showname;
        showData.datestamp = date;
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('myDBZ').collection('showData').updateOne({'showname': showname}, {"$set": {
            showname: showData.showname,
            showimage: showData.showimage,
            price: showData.price,
            tickets: showData.tickets,
            showdate: showData.showdate,
            place: showData.place,
            datestamp: date
        }});
        await client.close();
        res.status(200).send({
        "status": "ok",
        "message": "Show data with show name = "+showname+" is updated",
        "showData": showData
        });
    }catch (error) {
        res.status(400).send(`message: ${ error }`);
    }
})
app.delete('/showData/delete', async(req, res) => {
    try {
        const showname = parseInt(req.body.showname);
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('myDatabase').collection('users').deleteOne({'showname': showname});
        await client.close();
        res.status(200).send({
        "status": "ok",
        "message": "Show Data with show name = "+showname+" is deleted"
        });
    }catch (error) {
        res.status(400).send(`message: ${ error.code }`);
    }
})

app.post('/payment/create', async(req, res) => {
    try {
        const date = new Date().toLocaleString();
        const payment = req.body;
        payment.datestamp = date;
        const client = new MongoClient(uri);
        await client.connect();
        await client.db('myDBZ').collection('payment').insertOne({
            // paymentnum is unique
            name: payment.name,
            paymentnum: payment.paymentnum,
            exp: payment.exp,
            securitycode: payment.securitycode,
            check: payment.check,
            datestamp: date
        });
        await client.close();
        res.status(200).send({
            "status": "ok",
            "payment": payment
        });
    } catch (error) {
        res.status(400).send(`message: ${ error}`);
    }
})
app.get('/payment', async(req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const payment = await client.db('myDBZ').collection('payment').find({}).toArray();
        await client.close();
        res.status(200).send(payment);
    }catch (error) {
        res.status(400).send(`message: ${ error }`);
    }
})