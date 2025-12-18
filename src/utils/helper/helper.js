import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../constent.js";

const usernameSchema = new mongoose.Schema(
  {
    usersUniqueUsername: [String],
  },
  { timestamps: true }
);

export const UniqueUsername = mongoose.model("UniqueUsername", usernameSchema);

const allCharacter =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123467890";

//   username create functions
export const generateUsername = async () => {
  let result = "";
  let unique = false;

  while (!unique) {
    // generate random username
    result = "";
    for (let i = 0; i < 26; i++) {
      result += allCharacter[Math.floor(Math.random() * allCharacter.length)];
    }

    // check if this username already exists
    const findResultExist = await UniqueUsername.findOne({
      usersUniqueUsername: result,
    });

    if (!findResultExist) {
      // username is unique
      unique = true;

      // save to DB
      await UniqueUsername.create({ usersUniqueUsername: [result] });

      return result; // return generated username
    }

    // যদি duplicate থাকে, loop আবার চলবে
  }
};

// generate hashing password function
export const generatePasswordHash = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const generateAccessToken = async (payload) => {
  const result = await jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: 1000 * 60 * 60 * 24 * 30,
  });
  return result;
  ad;
};
