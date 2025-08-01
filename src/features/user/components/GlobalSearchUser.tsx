import { findUser } from "@/api/handler";
import { useSelectedUserContext } from "@/features/chat/hooks";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, type FC } from "react";
import { UserProfile } from "./UserProfile";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_photo: string;
}

export const GlobalSearchUser: FC = () => {
  const [value, setSearchValue] = useState("");
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { setSelectedUser } = useSelectedUserContext();
  const [userId, setUserId] = useState<number | null>();
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    const debouncingFunction = setTimeout(() => {
      if (value.trim() === "") {
        setSearchUsers([]);
        setTotalPages(1);
        return;
      }
      async function fetchUsers() {
        const params = new URLSearchParams({
          value,
          page: page.toString(),
          pageSize: "10",
          sortBy: "first_name",
          sortType: "desc",
        });
        const response = await findUser(params.toString());
        const users = response.data.data || [];
        const totalCount = response.data.totalRows || 0;
        setSearchUsers(users);
        setTotalPages(Math.ceil(totalCount / 10));
      }
      fetchUsers();
    }, 300);
    return () => clearTimeout(debouncingFunction);
  }, [value, page]);

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const onClose = () => {
    setModal(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users to start chat"
        className="input"
        value={value}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setPage(1);
        }}
      />

      {value ? (
        <ul className="w-[300px] h-[500px] m-5 overflow-y-auto border border-gray-300">
          {searchUsers.length > 0 ? (
            searchUsers.map((user) => (
              <li key={user.user_id} className="flex p-1.5 items-center">
                <img
                  src={user.profile_photo}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-8 h-8 rounded-full ring-2 ring-red-200 cursor-pointer"
                  onClick={() => {
                    setUserId(user.user_id);
                    setModal(true);
                  }}
                />
                <span className="ml-3 truncate w-[190px]">
                  {user.first_name} {user.last_name}
                </span>
                <button
                  className="ml-auto bg-gray-300 rounded-md p-1.5 hover:ring-3 hover:ring-gray-500"
                  onClick={() => setSelectedUser(user)}
                >
                  Chat
                </button>
              </li>
            ))
          ) : (
            <li className="text-center p-5 m-5 w-[80%] text-2xl">
              No User Found
            </li>
          )}
        </ul>
      ) : (
        <ul>
          <li className="text-center p-5 m-5 w-[80%] text-xl">
            Start Search To Chat
          </li>
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:ring-3 hover:ring-gray-500"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1 rounded ${
                num === page
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:ring-2 hover:ring-gray-400"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:ring-3 hover:ring-gray-500"
          >
            Next
          </button>
        </div>
      )}
      {modal && <UserProfile onClose={onClose} userId={Number(userId)} />}
    </div>
  );
};
