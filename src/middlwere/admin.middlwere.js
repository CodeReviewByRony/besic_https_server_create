import { User } from "../models/user.model.js";
import { ApiError, sendApiResponce } from "../utils/class/class.js";

export const adminMiddlwere = async (req, res, next) => {
  try {
    const token = req.headers.cookie;

    if (!token) {
      return sendApiResponce(
        res,
        new ApiError(401, "unAuthozied user in admin")
      );
    }

    const tokenParts = token.split("=")[1];

    const findUser = await User.findOne({ accessToken: tokenParts });

    if (!findUser) {
      return sendApiResponce(
        res,
        new ApiError(403, "unauthorized user in admin middlwere")
      );
    }

    if (findUser.role === "admin") {
      next();
    } else {
      {
        // যদি রোল এডমিন না হয়
        return sendApiResponce(
          res,
          new ApiError(403, "Access denied. Admins only.")
        );
      }
    }
  } catch (error) {
    console.log("admin middlwere error : ", error);
    return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
  }
};
