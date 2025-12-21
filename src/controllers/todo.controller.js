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

      const findOwnTodo = await Todo.find({ todoOwner: id })
        .sort({
          createdAt: -1,
        })
        .populate("todoOwner", "name email role createdAt");

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

export const todoUpdateUserWonTodo = (req, res) => {
  // const params = req.params;
  // const paramsArr = Object.entries(params);
  // const userID = paramsArr[0][1];
  // const todoID = paramsArr[1][1];

  const { userID, todoID } = req.params;

  console.log(todoID, userID);

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { todoTitle, todoPara } = JSON.parse(body);

      const id = req.user._id;

      if (userID !== id.toString()) {
        return sendApiResponce(
          res,
          new ApiError(401, "unAuthorised in todo update controller")
        );
      }

      const findUser = await User.findById(id);

      if (!findUser) {
        return sendApiResponce(
          res,
          new ApiError(401, "unauthorised in todo update controller")
        );
      }

      const findTodo = await Todo.findOne({ _id: todoID });

      if (!findTodo) {
        return sendApiResponce(res, new ApiError(404, "not found a todo"));
      }

      if (findTodo.todoOwner.toString() !== id.toString()) {
        return sendApiResponce(
          res,
          new ApiError(403, "Forbidden: not your todo")
        );
      }

      if (!todoTitle || !todoPara) {
        return sendApiResponce(
          res,
          new ApiError(400, "these field are required")
        );
      }

      // const updateTodo = {
      //   todoTitle,
      //   todoPara,
      // };

      const updateTodo = await Todo.findByIdAndUpdate(
        { _id: todoID, todoOwner: id },
        { $set: { todoTitle, todoPara } },
        { new: true }
      );

      return sendApiResponce(
        res,
        new ApiSuccess(200, "update todo done", updateTodo)
      );
    } catch (error) {
      console.log("user won todo update controller error : ", error);
      return sendApiResponce(res, new ApiError(500, "Internal Server Error"));
    }
  });
};
