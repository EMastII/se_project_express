const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());
app.use(auth);
app.use("/", mainRouter);

app.listen(PORT, () => {});
