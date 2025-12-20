import jwt from "jsonwebtoken";

import { ApiError, sendApiResponce } from "../utils/class/class.js";
import { ACCESS_TOKEN_SECRET } from "../constent.js";
import { User } from "../models/user.model.js";

export const authMiddlwere = (req, res, next) => {
  try {
    const authHeaders = req.headers.cookie;
    if (!authHeaders) {
      return sendApiResponce(
        res,
        new ApiError(401, "authorization header missing")
      );
    }

    // console.log("hearde4r :", authHeaders);

    // "Bearer tokenvalue" থেকে token আলাদা করা
    const token = authHeaders.split("=")[1];

    if (!token) {
      return sendApiResponce(res, new ApiError(401, "Token missing"));
    }

    // console.log("token :", token);

    //   token verify
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return sendApiResponce(
          res,
          new ApiError(403, "Invalid or expired token")
        );
      }

      // console.log("token :", token);

      // Token valid হলে user id attach করা req object-এ

      const findUser = await User.findOne({ accessToken: token });

      // console.log("middle user :", findUser);

      if (!findUser) {
        return sendApiResponce(
          res,
          new ApiError(401, "Unauthorized in middlwere")
        );
      }

      if (decoded) {
        req.user = findUser; // decoded payloadData থেকে id নেওয়া
      }

      next(); // পরের handler call
    });
  } catch (error) {
    console.log("auth middlwere error : ", error);
    return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
  }
};
