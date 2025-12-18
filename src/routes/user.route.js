import { newUserCreate } from "../controllers/user.controller.js";

export const userRoute = [
  {
    method: "POST",
    path: "/user/register",
    handler: newUserCreate,
  },
];
