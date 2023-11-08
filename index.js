const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json())

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8fxooh6.mongodb.net/?retryWrites=true&w=majority`;

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

const FoodCollection = client.db('FlavourFusion').collection('AllFood')
const myAddedItems = client.db('FlavourFusion').collection('myAddedFoodItems'); 
const MyOrdersCollection = client.db('FlavourFusion').collection('MyOrders');
app.get('/allFoods', async(req,res) =>{
    const cursor = FoodCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})

app.get('/allFoods/:id', async (req,res) =>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await FoodCollection.findOne(query)
  res.send(result)
  })

app.get('/addafooditem',async(req,res)=>{
    const cursor = myAddedItems.find()
    const result = await cursor.toArray()
    res.send(result)
})
app.get('/addafooditem/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
const result = await myAddedItems.findOne(query)
res.send(result)
})

app.post('/addafooditem',async(req,res)=>{
    const newFood = req.body;
    console.log(newFood);
    const result = await myAddedItems.insertOne(newFood)

res.send(result)

})



//my orders collections


app.get('/myorders',async(req,res)=>{
  const cursor = MyOrdersCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})


app.post('/myorders',async (req,res)=>{
  const myorder = req.body;
  console.log(myorder);
  const result = await MyOrdersCollection.insertOne(myorder);
  res.send(result)
})











app.put('/addafooditem/:id', async(req,res) =>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true }; 
    const updatedfood = req.body;
    const food= {
      $set: {
        Food_name:updatedfood.Food_name,
        price:updatedfood.price,
        quantity:updatedfood.quantity,
        Food_image:updatedfood.Food_image,
        price:updatedfood.price,
        Food_category:updatedfood.Food_category,
        Food_origin:updatedfood.Food_origin,
        description:updatedfood.description

      }
  
    }
  
    const result = await myAddedItems.updateOne(filter, food,options);
    res.send(result)
  })






  app.delete('/myorders/:id',async(req,res)=>{
    const id = req.params.id
    const query= {_id:new ObjectId(id)}
    const result = await MyOrdersCollection.deleteOne(query) 
    res.send(result)
    
  })













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{

    res.send('FlavorFusionpalace is running')
})



app.listen(port,()=>{
    console.log(`flavorFusion is running on port ${port}`);
})