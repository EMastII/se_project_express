const router = require("express").Router();

const auth = require("../middlewares/auth");
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { signup, signin } = require("../controllers/users");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.post("/signup", signup);
router.post("/signin", signin);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
