const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
// const uploadRoutes = require("./routes/upload");
// app.use("/api", uploadRoutes);










const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)



const port=process.env.PORT || 5000;

const corsOption = {
    origin: [
      'http://localhost:5173',
      'https://blood-donation-applicati-9d609.web.app',
      'https://blood-donation-applicati-9d609.firebaseapp.com',
      'http://localhost:5174/'
    
  
    ],
    credentials: true,
    optionsSuccessStatus: 200
  };


//  MIDDLEWARE
// const cors = require('cors');

// app.use(cors({
//     origin: 'http://localhost:5173', // Allow requests from your frontend
//     credentials: true // Allow cookies/session authentication
// }));








// MIDDLEWARE
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser())





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

/*
 
Store ID: bistr67ab628c506cc
Store Password (API/Secret Key): bistr67ab628c506cc@ssl


Merchant Panel URL: https://sandbox.sslcommerz.com/manage/ (Credential as you inputted in the time of registration)


 
Store name: testbistrngzj
Registered URL: www.bistroboss.com
Session API to generate transaction: https://sandbox.sslcommerz.com/gwprocess/v3/api.php
Validation API: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl
Validation API (Web Service) name: https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
 

*/

const verifyToken= (req,res,next)=>{
    const token=req.cookies?.token;
    if(!token) return res.status(401).send({message:'unAuthorized access'})
     jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
   if(err) {
     return res.status(401).send({message:'unAuthorized access'})
   }
   
   req.user=decoded
   
   
     })
    
   
   
   
     next();
   
   }
   












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
    const blogCollection=client.db('bloodDonationDB').collection('blog');
    const paymentCollection=client.db('bloodDonationDB').collection('payments');




    
    

    









    // Auth releted api

        // generate jwt
        app.post('/jwt',async(req,res)=>{
            const email=req.body;
            // create token
            const token= jwt.sign(email,process.env.SECRET_KEY,{expiresIn:'100d'})
      
            // console.log(token);
            // res.send(token);
            res.cookie('token',token,{
              httpOnly:true,
              secure:process.env.NODE_ENV==='production',
              sameSite:process.env.NODE_ENV==='production'? 'none': 'strict'
      
      
            }).send({success:true})
          })
      
      
          // logout cookie
          // clear cookie
          app.get('/logout',async(req,res)=>{
            res.clearCookie('token',{
             maxAge: 0,
              secure:process.env.NODE_ENV==='production',
              sameSite:process.env.NODE_ENV==='production'? 'none': 'strict'
      
            }).send({success:true})
          })
      





    // payment intent
    app.post('/create-payment-intent', async (req, res) => {
        const { price } = req.body;
        
        // Ensure the price is a valid number and does not exceed the limit
        const amount = parseInt(price * 100);  // Stripe expects the amount in cents
        
        const MAX_AMOUNT = 999999.99;  // Max limit in dollars
        if (amount > MAX_AMOUNT * 100) {  // Convert max amount to cents
            return res.status(400).send({
                error: `Amount must be no more than ${MAX_AMOUNT} USD.`
            });
        }
    
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
            });
    
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (err) {
            console.error("Error creating payment intent:", err);
            res.status(500).send({
                error: "Failed to create payment intent. Please try again."
            });
        }
    });



    // payment data
    app.post('/payments',async(req,res)=>{
        const payment=req.body;
        const paymentResult=await paymentCollection.insertOne(payment)
        

        res.send(paymentResult)

    })
    // payment data
    app.get('/payments',verifyToken,async(req,res)=>{
     
      const  cursor=paymentCollection.find();
      const result=await cursor.toArray();
      res.send(result);

    })

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
    app.get('/users', verifyToken,async(req,res)=>{
        const email=req.query.email;
        const query={email:email};

        const result=await usersCollection.find(query).toArray();
        res.send(result);
    })


   // Import necessary modules
app.patch('/users/login-time', async (req, res) => {
    try {
        const { email } = req.body; // Get email from the request body
        const loginTime = new Date().toISOString(); // Get the current login time

        // Update the login time in the database
        const result = await usersCollection.updateOne(
            { email: email }, // Find the user by email
            { $set: { loginTime: loginTime } } // Set the loginTime to the current time
        );

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Login time updated successfully' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating login time:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

   



    // get all user
    app.get('/allusers',verifyToken,async(req,res)=>{
       
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

      app.patch("/allusers/:id/edit", async (req, res) => {
        const { id } = req.params;
        const {
            name,
            email,
            photo,
            bloodgroup,
            districtName,
            districtNameBan,
            upazilaName,
            upazilaNameBan,
            districtID,
            upazilaID,
        } = req.body;
    
        try {
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name,
                        email,
                        photo,
                        bloodgroup,
                        districtName,
                        districtNameBan,
                        upazilaName,
                        upazilaNameBan,
                        districtID,
                        upazilaID,
                    },
                }
            );
            if (result.modifiedCount > 0) {
                res.json({ success: true, message: "Profile updated successfully", result });
            } else {
                res.status(400).json({ success: false, message: "No changes made" });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update profile", error });
        }
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



// Search but error for this not used
    // app.get("/alluserssearch", async (req, res) => {
    //     try {
    //         const { bloodgroup, district, upazila } = req.query;
    
    //         if (!bloodgroup || !district || !upazila) {
    //             return res.status(400).json({ error: "Missing search parameters" });
    //         }
    
    //         const query = {
    //             bloodgroup: { $regex: new RegExp(bloodgroup, "i") },
    //             district: { $regex: new RegExp(district, "i") },
    //             upazila: { $regex: new RegExp(upazila, "i") },
    //         };
    
    //         const usersCollection = db.collection("users");
    //         const result = await usersCollection.find(query).toArray();
            
    //         res.send(result);
    //     } catch (error) {
    //         console.error("Error searching users:", error);
    //         res.status(500).json({ error: "Internal Server Error" });
    //     }
    // });
    













     // post donation-requests
     app.post('/donation-requests',async(req,res)=>{
        const newData=req.body;
        // console.log(newData);
        const result=await requestsCollection.insertOne(newData);
        res.send(result);
    })

    
    // get all donation-requests
    app.get('/donation-requests',verifyToken,async(req,res)=>{
       
        const result=await requestsCollection.find().toArray();
        res.send(result);
    })

// get spacific by id donation request
    app.get('/donation-requests/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await requestsCollection.findOne(query);
        res.send(result);
      });
    
      app.patch("/donation-requests/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { DonorId, DonorName, DonorEmail, status } = req.body;
    
            // Validate ObjectId before querying
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: "Invalid request ID" });
            }
    
            const updateResult = await requestsCollection.updateOne(  // ✅ Correct collection used
                { _id: new ObjectId(id) },
                {
                    $set: {
                        DonorId,
                        DonorName,
                        DonorEmail,
                        status,
                    },
                }
            );
    
            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ error: "Donation request not found" });
            }
    
            res.json({ message: "Donation request updated successfully", updated: updateResult });
        } catch (error) {
            console.error("Error updating donation request:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

// done and cencel
    
app.patch("/donation-requestsdoneCencel/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // ✅ Ensure status is coming from request body

    try {
        const result = await requestsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status } }  // ✅ Correct field update
        );

        res.json({ success: true, message: "Status updated successfully", result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update status", error });
    }
});

    
      




















    // get all donation-requests delet
    app.delete('/donation-requests/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)} ;
        const result=await requestsCollection.deleteOne(query);
        res.send(result);
  
      })






    






    
    // for request setion logged user will show
    
    app.get('/donation-requests-logged-user',verifyToken,async(req,res)=>{
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






// blog section
// post blog
app.post('/blog',async(req,res)=>{
    const newData=req.body;
    // console.log(newData);
    const result=await blogCollection.insertOne(newData);
    res.send(result);
})
  // get blog
  app.get('/blog',async(req,res)=>{
       
    const result=await blogCollection.find().toArray();
    res.send(result);
})


app.delete("/blog/:id", async (req, res) => {
    const { id } = req.params;
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
});

app.patch("/blog/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await blogCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    );

    res.send(result);
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