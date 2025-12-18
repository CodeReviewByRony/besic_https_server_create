import { login, newUserCreate } from "../controllers/user.controller.js";

export const userRoute = [
  {
    method: "POST",
    path: "/user/register",
    handler: newUserCreate,
  },
  {
    method: "POST",
    path: "/user/login",
    handler: login,
  },
];
