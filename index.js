const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT || 5000;



// MIDDLEWARE
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uslpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });,


    const districtsCollection=client.db('bloodDonationDB').collection('districts');
    const upazilasCollection=client.db('bloodDonationDB').collection('upazilas');
    const usersCollection=client.db('bloodDonationDB').collection('users');
    const requestsCollection=client.db('bloodDonationDB').collection('donation-requests');



// districts get

    app.get('/districts',async(req,res)=>{
        const cursor=districtsCollection.find();
        const result=await cursor.toArray();
        res.send(result);


    })



//  get
    app.get('/upazilas',async(req,res)=>{
        const cursor=upazilasCollection.find();
        const result=await cursor.toArray();
        res.send(result);


    })


    // post user
    app.post('/users',async(req,res)=>{
        const newUser=req.body;
        // console.log(newUser);
        const result=await usersCollection.insertOne(newUser);
        res.send(result);
        
   
    })

    // get user
    app.get('/users',async(req,res)=>{
        const email=req.query.email;
        const query={email:email};


        const result=await usersCollection.find(query).toArray();
        res.send(result);
    })
    // get all user
    app.get('/allusers',async(req,res)=>{
       
        const result=await usersCollection.find().toArray();
        res.send(result);
    })


     // post donation-requests
     app.post('/donation-requests',async(req,res)=>{
        const newData=req.body;
        // console.log(newData);
        const result=await requestsCollection.insertOne(newData);
        res.send(result);
        
   
    })





















    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);











app.get('/',(req,res)=>{
    res.send('blood donation is running');
})

app.listen(port,()=>{
    console.log(`blood donation is in port ${port}`)

})