const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;
require('dotenv').config()
const cors = require('cors');

// middlewares
app.use(cors());
app.use(express.json())
app.use(express.static('public'))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rvwdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function bootstrap() {
  try {
    const database = client.db("User-CURD")
    const userCollection = database.collection("Users");

    // users get
    app.get('/users', async (req, res) => {
      const query = {};
      const result = await userCollection.find(query).toArray()
      //console.log(result);
      res.send(result)
      
    })

    // get a single user by using id 

     app.get('/users/:id', async (req,res) => {
       const id = req.params.id;
       //console.log(id);
       const query = { _id: new ObjectId(id) }
       const user = await userCollection.findOne(query); 
       res.send(user)
       
     })


    // user post
    app.post('/user', async (req,res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result)
        //console.log("Route matched", user);        

    })

    // update user
    app.put('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      //console.log(user);
      const option = { upsert: true }
      const updatedUser = {
        $set:{
          name: user.name,
          email: user.email,
          image: user.image
        }
      }
      const result = await userCollection.updateOne(filter,updatedUser, option)
      res.send(result)
      
    }) 

    // delete user
    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);

    });

  } finally {
    //await client.close();
  }
}
bootstrap().catch(console.dir);


app.get('/', (req, res) => {
  res.send('CURD SERVER RUNING PROPERLY')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})