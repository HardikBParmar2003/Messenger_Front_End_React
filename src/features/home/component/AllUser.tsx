import { SelectedUserContextProvider } from "@/features/chat/hooks/index";
import { useEffect, useState, type FC } from "react";
import {
  GlobalSearchUser,
  LocalSearchUser,
} from "../../user/components/index";
import { Chat } from "../../chat/components/index";
import { chattingUsers } from "@/api/handler";
import { NavBar } from "./NavBar";
import type { User } from "@/interface/interface";
import { useNotifictionContext } from "@/features/auth/hooks/NotificationFunction";
export const AllUser: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { askPermission } = useNotifictionContext();

  useEffect(() => {
    async function fetchUsers() {
      console.log(loading);
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

    fetchUsers();
  }, []);

  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <SelectedUserContextProvider>
        <div className="flex flex-col lg:flex-row gap-4 p-4 h-[calc(100vh-80px)]">
          <div className="w-full lg:w-1/4 bg-white border rounded-md p-2 shadow">
            <LocalSearchUser users={users} />
          </div>

          <div className="w-full lg:w-1/2 bg-white border rounded-md p-2 shadow flex-1">
            <Chat users={users} setUsers={setUsers} />
          </div>

          <div className="w-full lg:w-1/4 bg-white border rounded-md p-2 shadow">
            <GlobalSearchUser />
          </div>
        </div>
      </SelectedUserContextProvider>
    </div>
  );
};
