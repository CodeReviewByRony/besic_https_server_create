import jwt from "jsonwebtoken";

import { ApiError, sendApiResponce } from "../utils/class/class.js";
import { ACCESS_TOKEN_SECRET } from "../constent.js";

export const authMiddlwere = (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    if (!authHeaders) {
      return sendApiResponce(
        res,
        new ApiError(401, "authorization header missing")
      );
    }

    // "Bearer tokenvalue" থেকে token আলাদা করা
    const token = authHeaders.split(" ")[1];

    if (!token) {
      return sendApiResponce(res, new ApiError(401, "Token missing"));
    }

    //   token verify
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return sendApiResponce(
          res,
          new ApiError(403, "Invalid or expired token")
        );
      }

      // Token valid হলে user id attach করা req object-এ
      req.user = decoded.payloadData; // decoded payloadData থেকে id নেওয়া
      next(); // পরের handler call
    });
  } catch (error) {
    return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
  }
};
