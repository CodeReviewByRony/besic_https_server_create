import { User } from "../models/user.model.js";
import { ApiError, ApiSuccess, sendApiResponce } from "../utils/class/class.js";
import {
  generateAccessToken,
  generatePasswordHash,
  generateUsername,
  passwordDecoded,
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
      const passwordHashing = await generatePasswordHash(password);

      //   user create data
      const userData = {
        name,
        username: uniqueUsername,
        email,
        password: passwordHashing,
      };

      const user = await User.create(userData);

      //   user payload send to access generate token function
      const payloadData = user._id;
      const token = await generateAccessToken({ payloadData });

      // Header-এ attach করা
      res.setHeader("Authorization", `Bearer ${token}`);

      //   update access token
      user.accessToken = token;
      await user.save();

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

export const login = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { email, password } = JSON.parse(body);

      // field are not eampty parse
      if (!email || !password) {
        return sendApiResponce(
          res,
          new ApiError(400, "these field are required !")
        );
      }

      //   is email valid cheker
      const isEmailValid = emailCheker(email);
      if (!isEmailValid) {
        return sendApiResponce(res, new ApiError(400, "enter valid email"));
      }

      // is email exist
      const isEmailExist = await User.findOne({ email });

      // 1️⃣ user না থাকলে এখানেই return
      if (!isEmailExist) {
        return sendApiResponce(res, new ApiError(404, "email not found"));
      }

      // 2️⃣ এখন safe → password compare
      const isPasswordMatch = await passwordDecoded(
        password,
        isEmailExist.password
      );

      if (!isPasswordMatch) {
        return sendApiResponce(res, new ApiError(400, "password not match"));
      }

      //   user payload send to access generate token function
      const payloadData = isEmailExist._id;
      const token = await generateAccessToken({ payloadData });

      // Header-এ attach করা
      res.setHeader("Authorization", `Bearer ${token}`);

      //   update access token
      isEmailExist.accessToken = token;
      await isEmailExist.save();

      //   api data return
      return sendApiResponce(
        res,
        new ApiSuccess(201, "new user create done", { isEmailExist })
      );
    } catch (error) {
      console.log(" user login controller error : ", error);
      return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
    }
  });
};
