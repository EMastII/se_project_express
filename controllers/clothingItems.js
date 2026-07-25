const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const {
  BAD_REQUEST_ERROR,
  FORBIDDEN_ERROR,
  SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
        return res.status(BAD_REQUEST_ERROR).send({ message: evt.message });
      }

      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const addLike = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item id" });
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item id" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const removeLike = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item id" });
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item id" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(BAD_REQUEST_ERROR).send({ message: "Invalid item id" });
  }

  return ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You do not have permission to delete this item" });
      }

      return ClothingItem.findByIdAndDelete(id).then((deletedItem) =>
        res.send(deletedItem)
      );
    })
    .catch((evt) => {
      console.error("deleteItem error:", evt.name, evt.message);
      if (evt.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: "Invalid item id" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, addLike, removeLike, deleteItem };
