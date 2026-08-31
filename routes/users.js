const router = require("express").Router();
const {
  getCurrentUser,
  getProfile,
  updateUser,
} = require("../controllers/users");
const {
  validateId,
  validateUpdateProfile,
} = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.get("/:userId", validateId, getProfile);
router.patch("/me", validateUpdateProfile, updateUser);

module.exports = router;
