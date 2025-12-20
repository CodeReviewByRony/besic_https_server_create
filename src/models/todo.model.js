import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    todoTitle: { type: String, trim: true, required: true },
    todoPara: { type: String, trim: true, required: true },
    todoOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
