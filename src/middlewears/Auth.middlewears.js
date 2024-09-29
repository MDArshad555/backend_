import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const token = req.cookies?.accessToken || 
                 (req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : null);

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from database
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid token");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError(401, "Unauthorized: Invalid or expired token");
  }
});
