const router = require("express").Router();
const {
  getCurrentUser,
  updateUser,
  getUsers,
  createUser,
  getUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);
router.post("/", createUser);
router.get("/:userId", getUser);

module.exports = router;
