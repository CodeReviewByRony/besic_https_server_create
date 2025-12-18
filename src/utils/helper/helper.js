import mongoose from "mongoose";

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
