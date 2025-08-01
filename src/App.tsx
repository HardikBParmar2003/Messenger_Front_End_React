import { type FC } from "react";
import { useLoggedInUserContext } from "./features/user/hooks";
import { ToastNotify } from "./features/home/component";
import { AppRoutes } from "./routes";
import { LoaderComponent } from "./components/Loader/Loader";

export const App: FC = () => {
  const { loading } = useLoggedInUserContext();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderComponent />
      </div>
    );
  }
  return (
    <>
      <AppRoutes />
      <ToastNotify />
    </>
  );
};
