const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res.status(500).send({ message: "Error from getItems" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((evt) => {
      console.error("createItem error:", evt.name, evt.message);
      if (evt.name === "ValidationError") {
        return res.status(400).send({ message: evt.message });
      }

      return res.status(500).send({ message: "Error from createItem" });
    });
};

const addLike = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid item id" });
  }

  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((evt) => {
      console.error("addLike error:", evt.name, evt.message);
      if (evt.name === "CastError") {
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

  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((evt) => {
      console.error("removeLike error:", evt.name, evt.message);
      if (evt.name === "CastError") {
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

  return ClothingItem.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch((evt) => {
      console.error("deleteItem error:", evt.name, evt.message);
      if (evt.name === "CastError") {
        return res.status(400).send({ message: "Invalid item id" });
      }
      return res.status(500).send({ message: "Error from deleteItem" });
    });
};

module.exports = { getItems, createItem, addLike, removeLike, deleteItem };
