const router = require("express").Router();

const auth = require("../middlewares/auth");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/NotFoundError");
const { signup, signin } = require("../controllers/users");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.post("/signup", validateUserBody, signup);
router.post("/signin", validateLogin, signin);

router.use("/items", itemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;
