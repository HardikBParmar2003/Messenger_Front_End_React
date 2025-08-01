import { SelectedUserContextProvider } from "@/features/chat/hooks/index";
import { useEffect, useState, type FC } from "react";
import { GlobalSearchUser, LocalSearchUser } from "../../user/components/index";
import { Chat } from "../../chat/components/index";
import { chattingUsers } from "@/api/handler";
import { NavBar } from "./NavBar";
import type { User } from "@/interface/interface";
import { useNotifictionContext } from "@/features/auth/hooks/NotificationFunction";
export const AllUser: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { askPermission } = useNotifictionContext();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await chattingUsers();
        if (response.data.data) {
          setUsers(response.data.data);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        askPermission();
      }
    }
    // await ask
    fetchUsers();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-200 h-[750px]">
      <NavBar />
      <SelectedUserContextProvider>
        <div className="flex h-screen m-5">
          <div className="w-[25%] h-[80%] border- border-gray-400 bg-anmber-400">
            <LocalSearchUser users={users} />
          </div>
          <div className="w-[53%] h-[80%] border border-gray-400 bg-gray-300">
            <Chat users={users} setUsers={setUsers} />
          </div>
          <div className="w-[22%]  h-[80%]">
            <GlobalSearchUser />
          </div>
        </div>
      </SelectedUserContextProvider>
    </div>
  );
};
