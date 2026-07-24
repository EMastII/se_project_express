const router = require("express").Router();

const {
  getItems,
  createItem,
  addLike,
  removeLike,
  deleteItem,
} = require("../controllers/clothingItems");
//  CRUD

//  Read
router.get("/", getItems);

//  Create
router.post("/", createItem);

//  Delete
router.delete("/:id", deleteItem);

//  Like
router.put("/:id/likes", addLike);

//  Unlike
router.delete("/:id/likes", removeLike);

module.exports = router;
