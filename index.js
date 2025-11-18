const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(express.json());
app.use(cors());

//MongoDB Connection with the database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@crud-operation.iftbw43.mongodb.net/?appName=CRUD-operation`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// useEffect(() => {
//   axios("urlInformation")
//     .then((res) => console.log(res.data))
//     .catch((error) => console.log(error));
// }, []);

const run = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const serviceDB = client.db("serviceDB");
    const serviceCollection = serviceDB.collection("services");

    //getting the service information
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // updating information
    app.put("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const updatedInformation = req.body;
      const update = {
        $set: updatedInformation,
      };
      const result = await serviceCollection.updateOne(query, update);
      res.send(result);
    });

    // getting personal information through email
    app.get("/personalServices", async (req, res) => {
      //getting the email form the query
      const email = req.query.email;
      console.log(email);
      const query = {};
      //checking if the email exist
      if (email) {
        query.contact_email = email;
      }
      //finding information and posting it to the server
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // getting specifi information
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    //posting the service information
    app.post("/services", async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error.message);
  }

  app.delete("/services/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await serviceCollection.deleteOne(query);
    res.send(result);
  });
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Server is Running!");
});

app.listen(port, () => {
  console.log("This App is listening fron port : ", port);
});
