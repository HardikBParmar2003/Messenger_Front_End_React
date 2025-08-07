import {
  addMember,
  findUser,
  individualUser,
} from "@/api/handler";
import { useSelectedGroupContext } from "../hook";
import type { User } from "@/interface/interface";
import { useState } from "react";
import { useSocketContext } from "@/features/auth/hooks/SocketContext";
import { useLoggedInUserContext } from "@/features/user/hooks";
import { UserProfile } from "@/features/user/components/UserProfile";
type AddMemberProps = {
  isOpen: boolean;
  onClose: () => void;
  addUSer: (user: User) => void;
};

export function AddMember({ isOpen, onClose, addUSer }: AddMemberProps) {
  const [value, setvalue] = useState("");
  const [modal, setModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const { selectedGroup } = useSelectedGroupContext();
  const { socket } = useSocketContext();
  const { loggedInUser } = useLoggedInUserContext();
  const searchUser = async () => {
    const params = new URLSearchParams({
      value: value || "",
      page: "1",
      pageSize: "10",
      sortBy: "first_name",
      sortType: "desc",
    });
    const response = await findUser(params.toString());
    setSearchUsers(response.data.data);
  };

  const add = async (user: User) => {
    const formData = new FormData();
    const user_id = String(user.user_id);
    const group_id = String(selectedGroup?.group_id);
    const admin_name = String(
      loggedInUser?.first_name + " " + loggedInUser?.last_name
    );
    const user_name = String(user.first_name + " " + user.last_name);
    formData.append("member_id", user_id);
    formData.append("group_id", group_id);
    const response = await addMember(formData);
    const newMember = await individualUser(response.data.data.user_id);
    addUSer(newMember.data.data);
    socket!.emit("add member to group", user_id, group_id, admin_name);
    socket!.emit(
      "send group message",
      loggedInUser?.user_id,
      group_id,
      `${admin_name}  added ${user_name}`,
      selectedGroup?.group_name,
      user_id
    );
  };

  if (!isOpen) return null;

  const closeModal = () => {
    setModal(false);
  };

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
        <h2 className="text-xl font-semibold mt-4 mb-4">Add Member</h2>

        <div className="flex">
          <input
            type="text"
            value={value}
            placeholder="Search user by name or email"
            onChange={(e) => setvalue(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />
          <button
            onClick={searchUser}
            className="px-4 h-[44px] ml-2 text-xl bg-green-800 text-gray-800 rounded hover:bg-green-500"
          >
            Go
          </button>
        </div>

        {value ? (
          <ul className="w-[90%]  m-2 p-5 overflow-y-auto h-[70%]">
            {searchUsers.length > 0 ? (
              searchUsers.map((user: User) => (
                <li key={user.user_id} className="user-list w-[100%] flex p-3">
                  <img
                    src={user.profile_photo}
                    className="user-profile-image cursor-pointer w-8 h-8 rounded-full ring-2 ring-red-200"
                    onClick={()=>{
                      setUserId(user.user_id)
                      setModal(true)
                    }}
                  />
                  <span className="user-name w-[290px] ">
                    {user.first_name + " " + user.last_name}
                  </span>
                  <button
                    className="bg-gray-300 rounded-md p-1.5 ml-10 cursor-pointer hover:ring-2 hover:ring-blue-500"
                    onClick={() => add(user)}
                  >
                    ADD
                  </button>
                </li>
              ))
            ) : (
              <li className=" mr-5 text-2xl"> No User found </li>
            )}
          </ul>
        ) : (
          <ul>
            <li className="p-5 m-5 w-[80%] text-2xl ">Searh user to add</li>
          </ul>
        )}
      </div>
      {modal && <UserProfile onClose={closeModal} userId={Number(userId)} />}

    </div>
  );
}
