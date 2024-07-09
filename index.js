const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware

app.use(cors());
app.use(express.json());

//
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ymyoldm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //1. for creating assignment

    const createdAssignmentCollection = client
      .db("reset-Assignment-11")
      .collection("createdAssignments");

    //sending on server ie. post
    app.post("/createdAssignment", async (req, res) => {
      const newCollection = req.body;
      console.log(newCollection);
      const result = await createdAssignmentCollection.insertOne(newCollection);
      res.send(result);
    });

    //for reading from mongodb

    app.get("/createdAssignment", async (req, res) => {
      let query = {};
      if (req.query?.difficulty) {
        query = { difficulty: req.query.difficulty };
      }
      const cursor = createdAssignmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //deleting from mongodb

    app.delete("/createdAssignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await createdAssignmentCollection.deleteOne(query);
      res.send(result);
    });

    // updating from mongodb

    //finding data from mongodb

    app.get("/createdAssignment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await createdAssignmentCollection.findOne(query);
      res.send(result);
    });

    //updating data of mongodb data

    app.put("/createdAssignment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAssignment = req.body;

      const createdAssignment = {
        $set: {
          title: updatedAssignment.title,
          description: updatedAssignment.description,
          marks: updatedAssignment.marks,
          difficulty: updatedAssignment.difficulty,
          startDate: updatedAssignment.startDate,
          photo: updatedAssignment.photo,
        },
      };

      const result = await createdAssignmentCollection.updateOne(
        filter,
        createdAssignment,
        options
      );
      res.send(result);
      console.log(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
