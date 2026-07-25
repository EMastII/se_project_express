const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { SERVER_ERROR } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(express.json());

app.use("/", mainRouter);

app.use(
  // eslint-disable-next-line no-unused-vars
  (err, req, res, next) => {
    console.error(err);
    const { statusCode = SERVER_ERROR, message } = err;
    res.status(statusCode).send({
      message:
        statusCode === SERVER_ERROR
          ? "An error has occurred on the server."
          : message,
    });
  }
);

app.listen(PORT, () => {});
