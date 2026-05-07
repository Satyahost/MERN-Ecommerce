import HandleError from "../utils/handleError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import handleAsyncError from "./handleAsyncError.js";

/* VERIFY LOGIN USER */
export const verifyUserAuth = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new HandleError("Authentication missing. Please login first.", 401),
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new HandleError("User not found", 404));
  }

  req.user = user;

  next();
});

/* ROLE BASED ACCESS */
export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HandleError("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HandleError(`Role ${req.user.role} is not allowed`, 403));
    }

    next();
  };
};
