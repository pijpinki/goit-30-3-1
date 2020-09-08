const express = require("express");
const joi = require("joi");
const mongodb = require("mongodb");
const connection = require("../database/Connection");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const collection = await connection.database.collection("users");
    const users = await collection.findOne({
      _id: mongodb.ObjectId(req.params.userId)
    });

    res.send({ users });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 0, limit = 100 } = req.query;

    const collection = await connection.database.collection("users");
    const users = await collection
      .find({})
      .sort({ age: 1, name: 1 })
      .skip(limit * page)
      .limit(limit)
      .toArray();

    res.send({ users, count: (await collection.find({}).count()) / limit });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.post("/", async (req, res) => {
  try {
    await joi
      .object({
        login: joi.string().required(),
        name: joi.string().required(),
        age: joi.number()
      })
      .validateAsync();

    const collection = await connection.database.collection("users");
    const response = await collection.insertOne(req.body);

    res.send({ response });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const collection = connection.getCollection("users");

    await collection.updateOne(
      { _id: mongodb.ObjectId(userId) },
      {
        $set: req.body
      }
    );

    res.send({ ok: true });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.put("/:userId/cats", async (req, res) => {
  try {
    const { userId } = req.params;

    const collection = connection.getCollection("users");

    await collection.updateOne(
      { _id: mongodb.ObjectId(userId) },
      {
        $push: {
          cats: {
            ...req.body
          }
        }
      }
    );

    res.send({ ok: true });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const collection = connection.getCollection("users");

    await collection.removeOne({ _id: mongodb.ObjectId(userId) });

    res.send({ ok: true });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

module.exports = router;
