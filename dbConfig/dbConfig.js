import mongoose from "mongoose";
import { DBURL } from "../src/constent.js";

export const dbConnect = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("db connect successfully");
  } catch (error) {
    console.log("db connect error : ", error);
  }
};
