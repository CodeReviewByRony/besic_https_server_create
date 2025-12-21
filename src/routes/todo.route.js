import {
  getAllTodo,
  todoPost,
  userWonTodoList,
} from "../controllers/todo.controller.js";
import { authMiddlwere } from "../middlwere/auth.middlwere.js";

export const todoRoute = [
  {
    method: "POST",
    path: "/:id/todo-post",
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
    path: "/:id/dashboard",
    handler: userWonTodoList,
    middlwere: authMiddlwere,
  },
];
