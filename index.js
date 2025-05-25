
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.jcgtqm0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
   
    await client.connect();
    const dataCollection = client.db("CoffeeDb").collection('coffees');

    app.get('/coffees',async(req,res)=>{
      
        const result = await dataCollection.find().toArray();
        res.send(result)
        
    })
    app.get('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await dataCollection.findOne(query);
        res.send(result);
    })

    app.post('/coffees',async(req,res)=>{
   
        const newData = req.body;
        const result = await dataCollection.insertOne(newData);
        res.send(result);


    })

    app.put('/coffees/:id',async (req,res)=>{
        const id = req.params.id
        const filter = {_id:new ObjectId(id)}
        const options ={upsert:true}
        const UpdatedCoffee = req.body
        const updatedDoc = {$set: UpdatedCoffee}
 const result = await dataCollection.updateOne(filter,updatedDoc,options);
 res.send(result);

        }
    )
    app.delete('/coffees/:id',async(req,res)=>{
        const id = req.params.id;
        const query  = {_id: new ObjectId(id)}
        const result = await dataCollection.deleteOne(query);
        res.send(result);
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
 
 
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
   res.send('server is running');
  
});



app.listen(port, () => {
  console.log(`Coffee store listening on port ${port}`)
})