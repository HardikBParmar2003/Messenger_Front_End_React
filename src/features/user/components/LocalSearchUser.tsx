import { useSelectedUserContext } from "@/features/chat/hooks";
import { useMemo, useState } from "react";
import type { LocalSearchUserProps, User } from "@/interface/interface";
import { useLoggedInUserContext } from "../hooks";
import { UserProfile } from "./UserProfile";

export function LocalSearchUser({ users }: LocalSearchUserProps) {
  const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);
  const [userId, setUserId] = useState<number>();
  const { setSelectedUser, selectedUser } = useSelectedUserContext();
  const { loggedInUser } = useLoggedInUserContext();

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      (user.first_name + " " + user.last_name)
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
  }, [searchValue, users]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search local chat users"
        className="input w-full px-3 py-2 border rounded mb-2"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <ul className="h-[550px] overflow-y-auto bg-white rounded-xl space-y-2 p-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user: User) => (
            <li
              key={user.user_id}
              className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${
                user.user_id === selectedUser?.user_id
                  ? "bg-gray-400"
                  : "hover:bg-gray-300"
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profile_photo}
                className="w-9 h-9 rounded-full ring-2 ring-red-200 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setModal(true);
                  setUserId(user.user_id);
                }}
              />
              <span className="truncate">
                {user.first_name} {user.last_name}
                {user.user_id === loggedInUser?.user_id && " (You)"}
              </span>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-400">No User Found</li>
        )}
      </ul>

      {modal && <UserProfile onClose={() => setModal(false)} userId={Number(userId)} />}
    </div>
  );
}
