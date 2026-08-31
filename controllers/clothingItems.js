const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const BadRequestError = require("../utils/BadRequestError");
const ForbiddenError = require("../utils/ForbiddenError");
const NotFoundError = require("../utils/NotFoundError");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((evt) => {
      if (evt.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }

      return next(evt);
    });
};

const addLike = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequestError("Invalid item id"));
  }

  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch((evt) => {
      if (evt.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(evt);
    });
};

const removeLike = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequestError("Invalid item id"));
  }

  const userId = req.user._id;

  return ClothingItem.findByIdAndUpdate(
    id,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      return res.send(item);
    })
    .catch((evt) => {
      if (evt.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(evt);
    });
};

const deleteItem = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new BadRequestError("Invalid item id"));
  }

  return ClothingItem.findById(id)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }

      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }

      return ClothingItem.findByIdAndDelete(id).then((deletedItem) =>
        res.send(deletedItem)
      );
    })
    .catch((evt) => {
      if (evt.name === "CastError") {
        return next(new BadRequestError("Invalid item id"));
      }
      return next(evt);
    });
};

module.exports = { getItems, createItem, addLike, removeLike, deleteItem };
