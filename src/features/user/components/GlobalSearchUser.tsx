import { findUser } from "@/api/handler";
import { useSelectedUserContext } from "@/features/chat/hooks";
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
  const [userId, setUserId] = useState<number | null>(null);
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
        setSearchUsers(response.data.data || []);
        const totalCount = response.data.totalRows || 0;
        setTotalPages(Math.ceil(totalCount / 10));
      }

      fetchUsers();
    }, 300);

    return () => clearTimeout(debouncingFunction);
  }, [value, page]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search users to start chat"
        className="input w-full px-3 py-2 border rounded mb-2"
        value={value}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setPage(1);
        }}
      />

      <ul className="h-[500px] overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
        {value && searchUsers.length > 0 ? (
          searchUsers.map((user) => (
            <li key={user.user_id} className="flex items-center space-x-3">
              <img
                src={user.profile_photo}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-9 h-9 rounded-full ring-2 ring-red-200 cursor-pointer"
                onClick={() => {
                  setUserId(user.user_id);
                  setModal(true);
                }}
              />
              <span className="truncate flex-1">
                {user.first_name} {user.last_name}
              </span>
              <button
                className="bg-gray-300 rounded px-3 py-1 hover:ring-2 hover:ring-gray-400"
                onClick={() => setSelectedUser(user)}
              >
                Chat
              </button>
            </li>
          ))
        ) : value ? (
          <li className="text-center text-gray-500">No User Found</li>
        ) : (
          <li className="text-center text-gray-400">Start Search To Chat</li>
        )}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center mt-3 gap-2 flex-wrap">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
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
                  : "bg-gray-100 hover:ring-2 hover:ring-gray-400"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modal && <UserProfile onClose={() => setModal(false)} userId={Number(userId)} />}
    </div>
  );
};
