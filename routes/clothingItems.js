const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  addLike,
  removeLike,
  deleteItem,
} = require("../controllers/clothingItems");
//  CRUD

//  Read - public
router.get("/", getItems);

// Protected item operations
router.post("/", auth, createItem);
router.delete("/:id", auth, deleteItem);
router.put("/:id/likes", auth, addLike);
router.delete("/:id/likes", auth, removeLike);

module.exports = router;
