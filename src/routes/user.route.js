import {
  getAllUser,
  login,
  logout,
  newUserCreate,
  userUpdateField,
} from "../controllers/user.controller.js";
import { adminMiddlwere } from "../middlwere/admin.middlwere.js";
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
    method: "GET",
    path: "/user/log-out",
    handler: logout,
    middlwere: authMiddlwere,
  },
  {
    method: "PUT",
    path: "/:userID/dashboard",
    handler: userUpdateField,
    middlwere: authMiddlwere,
  },
  {
    method: "GET",
    path: "/user/all-user-list",
    handler: getAllUser,
    middlwere: [authMiddlwere, adminMiddlwere],
  },
];
