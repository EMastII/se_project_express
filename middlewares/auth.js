const jwt = require("jsonwebtoken");

const { JWT_SECRET = "dev-secret" } = process.env;

const parseCookie = (cookieHeader) => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((parsedCookies, cookiePair) => {
    const [key, ...valueParts] = cookiePair.trim().split("=");
    const value = valueParts.join("=");

    if (key && value) {
      return {
        ...parsedCookies,
        [key]: decodeURIComponent(value),
      };
    }

    return parsedCookies;
  }, {});
};

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookies = parseCookie(req.headers.cookie);
  const tokenFromHeader = (header) => {
    if (!header) {
      return null;
    }
    const normalized = header.trim();
    if (normalized.toLowerCase().startsWith("bearer ")) {
      return normalized.substring(7).trim();
    }
    return normalized;
  };

  const token =
    tokenFromHeader(authHeader) ||
    req.headers["x-access-token"] ||
    req.headers["x-auth-token"] ||
    cookies.jwt;

  if (!token) {
    return res.status(401).send({ message: "Authorization required" });
  }

  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err || !payload || !payload._id) {
      return res.status(401).send({ message: "Authorization required" });
    }

    req.user = { _id: payload._id };
    return next();
  });
};
