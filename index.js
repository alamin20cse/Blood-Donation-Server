const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const port=process.env.PORT || 5000;



// MIDDLEWARE
app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // get user logged
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

      // for  specific id data of user
      app.get('/allusers/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.findOne(query);
        res.send(result);
      });


      





      app.patch("/allusers/:id", async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
    
        try {
            const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });
            res.json({ success: true, message: "Status updated", result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update status", error });
        }
    });
    
    app.patch("/allusers/:id/role", async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;
    
        try {
            const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { role } });
            res.json({ success: true, message: "Role updated", result });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update role", error });
        }
    });
        




















     // post donation-requests
     app.post('/donation-requests',async(req,res)=>{
        const newData=req.body;
        // console.log(newData);
        const result=await requestsCollection.insertOne(newData);
        res.send(result);
    })

    
    // get all donation-requests
    app.get('/donation-requests',async(req,res)=>{
       
        const result=await requestsCollection.find().toArray();
        res.send(result);
    })



    
    // for request setion logged user will show
    
    app.get('/donation-requests-logged-user',async(req,res)=>{
        const email=req.query.email;
        const query = { email: email }; // Filtering by donorEmail

        const result=(await requestsCollection.find(query).sort({ requestTime: -1 }).toArray());
        res.send(result);
    })



    // for update get data
    app.get('/donation-requests-logged-user/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await requestsCollection.findOne(query);
        res.send(result);
      });


      app.delete('/donation-requests-logged-user/:id', async (req, res) => {  // ✅ Fixed method (was `app.get`, now `app.delete`)
        try {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await requestsCollection.deleteOne(query);
            
            if (result.deletedCount === 1) {
                res.json({ message: "Deleted successfully", deletedCount: 1 });
            } else {
                res.status(404).json({ message: "Donation request not found" });
            }
        } catch (error) {
            console.error("Error deleting request:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    



    //   update
    app.put('/donation-requests/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
    
        const updatedRequest = req.body;
    
        const updateDoc = {
            $set: {
                name: updatedRequest.name,
                email: updatedRequest.email,
                bloodgroup: updatedRequest.bloodgroup,
                districtName: updatedRequest.districtName,
                districtNameBan: updatedRequest.districtNameBan,
                upazilaName: updatedRequest.upazilaName,
                upazilaNameBan: updatedRequest.upazilaNameBan,
                recipientname: updatedRequest.recipientname,
                hospitalname: updatedRequest.hospitalname,
                fulladdress: updatedRequest.fulladdress,
                donationdate: updatedRequest.donationdate,
                donationtime: updatedRequest.donationtime,
                requestmessage: updatedRequest.requestmessage,
                districtID: updatedRequest.districtID,
                upazilaID: updatedRequest.upazilaID,
                status: updatedRequest.status,
                requestTime: updatedRequest.requestTime,
                donorID: updatedRequest.donorID,
                donorEmail: updatedRequest.donorEmail,
            },
        };
    
        try {
            const result = await requestsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        } catch (error) {
            console.error("Error updating document:", error);
            res.status(500).send({ error: "Failed to update document" });
        }
    });




















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