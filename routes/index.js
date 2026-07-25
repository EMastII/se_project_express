const router = require("express").Router();

const { signup, signin } = require("../controllers/users");
const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.post("/signup", signup);
router.post("/signin", signin);

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = router;
