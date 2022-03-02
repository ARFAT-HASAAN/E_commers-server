const express = require("express");
// const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT | 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.oq9xl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", async (req, res) => {
  res.send("tumi ki paiso");
});

async function run() {
  try {
    await client.connect();

    const database = client.db("ema_Jhon");
    const ProductCollection = database.collection("Products");

    app.get("/products", async (req, res) => {
      // console.log(req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const products = await ProductCollection.find();

      const count = await ProductCollection.count();
      let cursor;
      if (page) {
        cursor = await products
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        cursor = await products.limit(size).toArray();
      }

      // const result = await ProductCollection.insertOne(doc);
      res.send({ cursor, count });
      // console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("my port number is", port);
});
