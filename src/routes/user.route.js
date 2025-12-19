import {
  login,
  logout,
  newUserCreate,
} from "../controllers/user.controller.js";
import { authMiddlwere } from "../middlwere/auth.middlwere.js";

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
  {
    method: "POST",
    path: "/user/log-out",
    handler: logout,
    middlwere: authMiddlwere,
  },
];
