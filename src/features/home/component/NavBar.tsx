import { LogOut } from "@/features/auth/function";
import { LoggedInUserComponent } from "@/features/user/components";
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
      <div className="mb-2 sm:mb-0">
        <LoggedInUserComponent />
      </div>

      <div className="flex space-x-5 text-base font-medium text-gray-800">
        <Link to="/home" className="hover:underline">
          Home
        </Link>
        <Link to="/group/home" className="hover:underline">
          Groups
        </Link>
      </div>

      <button
        className="mt-2 sm:mt-0 bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded w-full sm:w-auto"
        onClick={LogOut}
      >
        Log Out
      </button>
    </nav>
  );
}
