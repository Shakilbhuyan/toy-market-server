const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
// app.use(cors());
const corsConfig = {
  origin: '',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8o8vfkj.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollections = client.db('toymarket').collection('toyCollection');

    app.get('/alltoy', async (req, res) => {
      const cursor = toyCollections.find();
      const result = await cursor.toArray();
      console.log("All Toys");
      res.send(result);
    });

    app.get('/mytoy/:email', async (req, res) => {
      const cursor = toyCollections.find({selleremail: req.params.email});
      const result = await cursor.toArray();
      res.send(result);
    });
    

    app.get('/alltoy/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result =  await toyCollections.findOne(query);
      res.send(result)
    })

   app.post('/addtoy', async(req, res)=>{
    const newToy = req.body;
    console.log('new toy', newToy)
    const result = await toyCollections.insertOne({...newToy});
    res.send(result)
   })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const objectID = new ObjectId(id);
      const result = await toyCollections.deleteOne({ _id: objectID });
      res.send(result);
    })

    app.patch('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const objectID = new ObjectId(id);
      const body = req.body;
      const result = await toyCollections.updateOne({ _id: objectID }, {$set: body});
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run();



app.get('/', (req, res) => {
  res.send('Server is Running.....')
})

app.listen(port, () => {
  console.log(`port is running on ${port}`)
})