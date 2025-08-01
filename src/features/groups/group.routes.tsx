import { type RouteObject } from "react-router-dom";
import { Auth } from "@/features/home/component/Auth";
import { GroupHome } from "./component";

const ProtectedGroupHome = Auth(GroupHome);

export const groupRoutes: RouteObject[] = [
  {
    path: "home",
    element: <ProtectedGroupHome />,
  },
];
