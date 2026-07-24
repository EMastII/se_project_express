module.exports = (req, res, next) => {
  const userId = req.headers["x-user-id"] || "61eade4c6d5acf558c42d9b8";
  req.user = { _id: userId };
  next();
};
