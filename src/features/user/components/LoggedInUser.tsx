import { useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "../hooks/index";

export function LoggedInUserComponent() {
  const navigate = useNavigate();
  const { loggedInUser } = useLoggedInUserContext();

  return (
    <div
      className="flex items-center gap-3 cursor-pointer"
      onClick={() => navigate("/home/updateUser")}
    >
      <img
        src={loggedInUser?.profile_photo}
        className="w-12 h-12 rounded-full ring-2 ring-red-200"
        alt="User profile"
      />
      <span className="text-lg font-medium text-gray-800">
        {loggedInUser?.first_name} {loggedInUser?.last_name}
      </span>
    </div>
  );
}
