const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const res = require("express/lib/response");
require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


// connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhalz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const serviceCollection = client.db('ePayment').collection('service');

        //get all product api
        app.get('/service', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        // get single product in the database
        app.get("/service/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id)};
        const sigleService = await serviceCollection.findOne(query);
        res.send(sigleService);
      });

    //   app.post('/create-payment-intent', async(req, res)=>{
    //     const service = req.body;
    //     const price = service.price;
    //     const amount = price * 100;
    //     console.log(amount)
    //     const paymentIntent = await stripe.paymentIntents.create({
    //         amount : amount,
    //         currency: 'usd',
    //         payment_method_types: ['card'],
    //     })
    //     res.send({clientSecret: paymentIntent.client_secret})
    //   });


    app.post('/login', (req, res)=>{
        const user = req.body;
        console.log(user);

        if(user.email === 'user@gmail.com' && user.password === '123456'){
            const accessToken = jwt.sign({email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
            res.send({
                success: true,
                accessToken: accessToken
            })
        }
        else{
            
        }
        res.send({success: false});
    })


    }
    finally {
        // something write
      }

}
run().catch(console.dir);





app.get('/', (req, res)=>{
    res.send("Welcome to E-commerce Shopping Server");
});

app.listen(port, (req, res)=>{
    console.log('Listening to the port', port);
})