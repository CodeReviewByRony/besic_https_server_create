import {
  getAllTodo,
  todoDeleteUserOwnTodo,
  todoPost,
  todoUpdateUserWonTodo,
  userWonTodoList,
} from "../controllers/todo.controller.js";
import { authMiddlwere } from "../middlwere/auth.middlwere.js";

export const todoRoute = [
  {
    method: "POST",
    path: "/:userID/todo-post",
    handler: todoPost,
    middlwere: authMiddlwere,
  },
  {
    method: "GET",
    path: "/",
    handler: getAllTodo,
  },
  {
    method: "GET",
    path: "/:userID/dashboard",
    handler: userWonTodoList,
    middlwere: authMiddlwere,
  },
  {
    method: "PUT",
    path: "/:userID/dashboard/:todoID/todo",
    handler: todoUpdateUserWonTodo,
    middlwere: authMiddlwere,
  },
  {
    method: "DELETE",
    path: "/:userID/dashboard/:todoID/todo-delete",
    handler: todoDeleteUserOwnTodo,
    middlwere: authMiddlwere,
  },
];
