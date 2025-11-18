const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { useEffect } = require("react");

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
    // getting specifi information
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
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
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The Server is Running!");
});

app.listen(port, () => {
  console.log("This App is listening fron port : ", port);
});
