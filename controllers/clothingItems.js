const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(() => {
      res.status(500).send({ message: "Error from getItems" });
    });
};

const createItem = (req, res) => {
  console.log("POST /items body:", req.body);
  const { name, weather, imageUrl } = req.body;
  // console.log(req.user);
  //const owner = req.user._id;

  // if (!name || !weather || !imageUrl) {
  //   return res.status(400).send({ message: "Missing required fields" });
  // }

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((e) => {
      console.error("createItem error:", e.name, e.message);
      if (e.name === "ValidationError") {
        return res.status(400).send({ message: e.message });
      }

      return res.status(500).send({ message: "Error from createItem" });
    });
};

const addLike = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(item);
    })
    .catch((e) => {
      console.error("addLike error:", e.name, e.message);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return res.status(500).send({ message: "Error from addLike" });
    });
};

const removeLike = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  ClothingItem.findByIdAndUpdate(id, { $pull: { likes: id } }, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(item);
    })
    .catch((e) => {
      console.error("removeLike error:", e.name, e.message);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return res.status(500).send({ message: "Error from removeLike" });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  ClothingItem.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(item);
    })
    .catch((e) => {
      console.error("deleteItem error:", e.name, e.message);
      if (e.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return res.status(500).send({ message: "Error from deleteItem" });
    });
};

module.exports = { getItems, createItem, addLike, removeLike, deleteItem };
