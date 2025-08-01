import { chatDownload, fetchChatData } from "@/api/handler";
import type { Chat, chatProps } from "@/interface/interface";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLoggedInUserContext } from "../../user/hooks/index";
import { useSelectedUserContext } from "../hooks/index";
import { ShowChatData } from "./index";
import { UserProfile } from "@/features/user/components/UserProfile";

export function Chat({ setUsers }: chatProps) {
  const { selectedUser, setSelectedUser } = useSelectedUserContext();
  const { loggedInUser } = useLoggedInUserContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  useEffect(() => {
    if (!selectedUser) {
      setSelectedUser(loggedInUser!);
    }
    const user_id: number = Number(selectedUser?.user_id);
    async function FetchChatData(): Promise<void> {
      try {
        if (user_id) {
          const response = await fetchChatData(user_id);
          if (response.data.data.length > 0) {
            setChatData(response.data.data);
          } else {
            setChatData([]);
          }
        }
      } catch (error) {
        setChatData([]);
        throw error;
      }
    }
    FetchChatData();
  }, [selectedUser]);

  async function downloadChat(): Promise<void> {
    try {
      setLoading(true);
      const data = {
        user_id: selectedUser?.user_id as number,
        user_name: (selectedUser?.first_name +
          " " +
          selectedUser?.last_name) as string,
      };
      const response = await chatDownload(data);
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const onClose = () => {
    setModal(false);
  };

  return (
    <>
      <div className="flex m-1 justify-between">
        <div className="flex mt-1">
          <img
            src={selectedUser?.profile_photo}
            className="user-profile-image w-[60px] h-[60px] rounded-full ring-2 ring-red-200 cursor-pointer"
            key={selectedUser?.user_id}
            onClick={() => {
              setModal(true);
              setUserId(selectedUser?.user_id);
            }}
          />
          {loggedInUser?.user_id === selectedUser?.user_id ? (
            <span className="text-lg m-[15px]">
              {selectedUser?.first_name} {selectedUser?.last_name} (You)
            </span>
          ) : (
            <span className="text-lg m-[15px]">
              {selectedUser?.first_name} {selectedUser?.last_name}
            </span>
          )}
        </div>
        <div>
          {loading ? (
            <span>
              Loading...
              <svg
                aria-hidden="true"
                role="status"
                className="  text-xl m-[20px] p-0.5 inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
            </span>
          ) : (
            <button onClick={downloadChat} className="bg-k-100 m-3.5 text-3xl">
              <FontAwesomeIcon
                icon={faFilePdf}
                className="text-green-800 border  p-1.5 hover:cursor-pointer rounded-sm"
              />
            </button>
          )}
        </div>
      </div>
      <ShowChatData ChatData={chatData} setUsers={setUsers} />
      {modal && <UserProfile onClose={onClose} userId={Number(userId)} />}
    </>
  );
}
