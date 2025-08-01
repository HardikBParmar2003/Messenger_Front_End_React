import { useLoggedInUserContext } from "@/features/user/hooks";
import type { User, ViewGroupMemberProps } from "@/interface/interface";
import { useMemo, useState } from "react";

export function ViewGroupMember({
  isOpen,
  onClose,
  groupUsers,
}: ViewGroupMemberProps) {
  const [value, setValue] = useState("");
  const { loggedInUser } = useLoggedInUserContext();
  const filteredUsers = useMemo(() => {
    return groupUsers.filter((user) =>
      (user.first_name + " " + user.last_name)
        .toLowerCase()
        .includes(value.toLowerCase())
    );
  }, [value, groupUsers]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[30%] h-[70%] shadow-md relative">
        <button
          className="absolute  top-1 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
          aria-label="Close modal"
          onClick={onClose}
        >
          <span className="text-xl font-semibold leading-none">&times;</span>
        </button>
        <h2 className="text-xl font-semibold mt-4 mb-4">Group Members</h2>

        <div className="flex">
          <input
            type="text"
            value={value}
            placeholder="Search user by name"
            onChange={(e) => setValue(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />
        </div>

        <ul className="w-[90%]  m-2 p-5 overflow-y-auto h-[70%]">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => (
              <div key={user.user_id}>
                {user.user_id !== loggedInUser?.user_id && (
                  <li
                    key={user.user_id}
                    className="user-list w-[100%] flex p-3"
                  >
                    <img
                      src={user.profile_photo}
                      className="user-profile-image cursor-pointer w-8 h-8 rounded-full ring-2 ring-red-200"
                    />
                    <span className="user-name w-[290px] ">
                      {user.first_name + " " + user.last_name}
                    </span>
                  </li>
                )}
              </div>
            ))
          ) : (
            <li className=" mr-5 text-2xl"> No user found </li>
          )}
        </ul>
      </div>
    </div>
  );
}
