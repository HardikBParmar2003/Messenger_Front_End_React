import { type RouteObject } from "react-router";
import { Auth } from "@/features/home/component/Auth";
import { AllUser, UpdateUser } from "./components";

const ProtectedAllUser = Auth(AllUser);
const ProtectedUpdateUser = Auth(UpdateUser);

export const UserRoutes: RouteObject[] = [
  {
    path: "",
    element: <ProtectedAllUser />,
  },
  {
    path: "updateUser",
    element: <ProtectedUpdateUser />,
  },
];
