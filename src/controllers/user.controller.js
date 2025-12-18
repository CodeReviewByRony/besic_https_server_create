import { User } from "../models/user.model.js";
import { ApiError, ApiSuccess, sendApiResponce } from "../utils/class/class.js";
import {
  generatePasswordHash,
  generateUsername,
} from "../utils/helper/helper.js";
import { emailCheker, passwordCheker } from "../utils/validator/validator.js";

export const newUserCreate = (req, res) => {
  console.log("✅ newUserCreate controller hit"); // <-- debug log
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      if (!body) {
        return sendApiResponce(res, new ApiError(400, "Request body is empty"));
      }

      const { name, email, password } = JSON.parse(body);

      //   these field are required ......
      if (!name || !email || !password) {
        return sendApiResponce(
          res,
          new ApiError(400, "these field are required !")
        );
      }

      // is email valid function .........
      const isEmailValid = emailCheker(email);
      if (!isEmailValid) {
        return sendApiResponce(res, new ApiError(400, "is not a email"));
      }

      //   is email exist in database ...........
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return sendApiResponce(
          res,
          new ApiError(400, "this email already exist, try different")
        );
      }

      //   password validator
      const isPasswordValid = passwordCheker(password);
      if (!isPasswordValid) {
        return sendApiResponce(
          res,
          new ApiError(400, "password must be 8 charecter's")
        );
      }

      //   call username create function
      const uniqueUsername = await generateUsername();

      //   password hashing function call
      const passwordHashing = generatePasswordHash(password);

      //   user create data
      const userData = {
        name,
        username: uniqueUsername,
        email,
        password: passwordHashing,
      };

      const user = await User.create(userData);

      return sendApiResponce(
        res,
        new ApiSuccess(201, "new user create done", { user })
      );
    } catch (error) {
      console.log("create user controller error : ", error);
      return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
    }
  });
};
