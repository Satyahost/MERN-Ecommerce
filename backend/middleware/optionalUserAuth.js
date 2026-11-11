import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const optionalUserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies || {};

    if (!token) {
      return next();
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decodedData.id);

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Invalid/expired token should not prevent
    // guest access to the AI assistant.
    next();
  }
};
