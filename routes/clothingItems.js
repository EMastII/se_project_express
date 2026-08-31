const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

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
router.post("/", auth, validateCardBody, createItem);
router.delete("/:id", auth, validateId, deleteItem);
router.put("/:id/likes", auth, validateId, addLike);
router.delete("/:id/likes", auth, validateId, removeLike);

module.exports = router;
