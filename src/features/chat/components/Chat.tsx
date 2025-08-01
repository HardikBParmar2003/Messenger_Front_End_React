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
import { LoaderComponent } from "@/components/Loader/Loader";

export function Chat({ setUsers }: chatProps) {
  const { selectedUser, setSelectedUser } = useSelectedUserContext();
  const { loggedInUser } = useLoggedInUserContext();

  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState<Chat[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileUserId, setProfileUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedUser && loggedInUser) {
      setSelectedUser(loggedInUser);
      return;
    }

    async function fetchChats() {
      if (!selectedUser?.user_id) return;

      try {
        const response = await fetchChatData(selectedUser.user_id);
        setChatData(response.data.data || []);
      } catch (error) {
        setChatData([]);
        console.error("Failed to fetch chat data:", error);
      }
    }

    fetchChats();
  }, [selectedUser, loggedInUser, setSelectedUser]);

  async function downloadChat() {
    if (!selectedUser) return;
    setLoading(true);

    try {
      const response = await chatDownload({
        user_id: selectedUser.user_id as number,
        user_name: `${selectedUser.first_name} ${selectedUser.last_name}`,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to download chat");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const openUserProfile = (userId: number) => {
    setProfileUserId(userId);
    setModalOpen(true);
  };

  const closeUserProfile = () => {
    setModalOpen(false);
    setProfileUserId(null);
  };

  return (
    <>
      <div className="flex justify-between items-center m-1">
        <div className="flex items-center space-x-3">
          <img
            src={selectedUser?.profile_photo}
            alt={`${selectedUser?.first_name} ${selectedUser?.last_name} profile`}
            className="w-14 h-14 rounded-full ring-2 ring-red-200 cursor-pointer object-cover"
            onClick={() =>
              selectedUser?.user_id && openUserProfile(selectedUser.user_id)
            }
          />
          <span className="text-lg font-medium">
            {selectedUser?.first_name} {selectedUser?.last_name}
            {loggedInUser?.user_id === selectedUser?.user_id ? " (You)" : ""}
          </span>
        </div>

        <div>
          {loading ? (
            <span>
              <LoaderComponent />
            </span>
          ) : (
            <button onClick={downloadChat} aria-label="Download chat as PDF">
              <FontAwesomeIcon
                icon={faFilePdf}
                className="text-green-800 border p-2 rounded-sm hover:bg-green-100 transition cursor-pointer text-2xl"
              />
            </button>
          )}
        </div>
      </div>

      <ShowChatData ChatData={chatData} setUsers={setUsers} />

      {modalOpen && profileUserId !== null && (
        <UserProfile onClose={closeUserProfile} userId={profileUserId} />
      )}
    </>
  );
}
