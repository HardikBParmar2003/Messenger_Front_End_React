import { AuthRoutes } from "@/features/auth/auth.routes";
import { groupRoutes } from "@/features/groups/group.routes";
import NotFound from "@/features/home/component/NotFound";
import { UserRoutes } from "@/features/user/user.routes";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth/*",
    children: AuthRoutes,
  },
  {
    path: "/home/*",
    children: UserRoutes,
  },
  {
    path: "/group/*",
    children: groupRoutes,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
