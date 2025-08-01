import { type FC } from "react";
import { Outlet } from "react-router";

export const AppLayout: FC = () => {
  return (
    <div >      
      <main >
        <Outlet />
      </main>
    </div>
  );
};
