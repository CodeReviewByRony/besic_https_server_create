import { Todo } from "../models/todo.model.js";
import { User } from "../models/user.model.js";
import { ApiError, ApiSuccess, sendApiResponce } from "../utils/class/class.js";

export const todoPost = (req, res) => {
  //   console.log("requesr header :", req.headers);
  //   console.log(req.params.split(":")[1].join());
  const params = req.params;
  const paramsStr = Object.values(params).join();
  // console.log(paramsStr);

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { todoTitle, todoPara } = JSON.parse(body);

      const id = req.user._id;
      // console.log(id.toString());

      if (paramsStr !== id.toString()) {
        return sendApiResponce(
          res,
          new ApiError(400, "requset params and user id not match")
        );
      } else {
        const findUser = await User.findById(id);

        if (!findUser) {
          return sendApiResponce(
            res,
            new ApiError(
              403,
              "todo post access denied, only logged user create post"
            )
          );
        }

        if (!todoTitle || !todoPara) {
          return sendApiResponce(
            res,
            new ApiError(400, "these field are required")
          );
        }

        const todoData = {
          todoTitle,
          todoPara,
          todoOwner: id,
        };

        await Todo.create(todoData);

        return sendApiResponce(
          res,
          new ApiSuccess(201, "todo create done", todoData)
        );
      }
    } catch (error) {
      console.log("post todo controller error : ", error);
      return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
    }
  });
};

export const getAllTodo = async (req, res) => {
  try {
    let allTodo = await Todo.find()
      .sort({ createdAt: -1 })
      .populate("todoOwner", "name email role createdAt");

    return sendApiResponce(
      res,
      new ApiSuccess(200, "get all todos done", allTodo)
    );
  } catch (error) {
    console.log("get all todo controller error : ", error);
    return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
  }
};

export const userWonTodoList = async (req, res) => {
  const params = req.params;
  const paramsStr = Object.values(params).join();
  // console.log(paramsStr);

  try {
    const id = req.user._id;
    // console.log(id.toString());

    if (paramsStr !== id.toString()) {
      return sendApiResponce(
        res,
        new ApiError(400, "requset params and user id not match")
      );
    } else {
      const findUser = await User.findById(id);

      if (!findUser) {
        return sendApiResponce(
          res,
          new ApiError(401, "unauthorized in user dashboard")
        );
      }

      const findOwnTodo = await Todo.find({ todoOwner: id }).sort({
        createdAt: -1,
      });

      if (!findOwnTodo || findOwnTodo.length === 0) {
        return sendApiResponce(
          res,
          new ApiError(400, "user own todo list eamty")
        );
      }

      return sendApiResponce(
        res,
        new ApiSuccess(200, "user won todo list get done", findOwnTodo)
      );
    }
  } catch (error) {
    console.log("user won todo list controller error : ", error);
    return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
  }
};
