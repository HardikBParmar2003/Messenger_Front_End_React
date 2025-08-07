import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "../../user/hooks/index";
import { useSocketContext } from "@/features/auth/hooks/SocketContext";
import {
  deleteGroupData,
  getGroupChat,
  getGroupUsers,
  groupChatDownload,
  userLeftGroup,
} from "@/api/handler";
import { useSelectedGroupContext } from "../hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faEdit,
  faEye,
  faFilePdf,
  faTrash,
  faUserMinus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { Group, User } from "@/interface/interface";
import { AddMember, EditGroupModal, RemoveMember, ShowGroupChat } from ".";
import { ViewGroupMember } from "./ViewGroupMember";
import { toast } from "react-toastify";
import { LoaderComponent } from "@/components/Loader/Loader";

type GroupUserProps = {
  onUpdateGroup: (updatedGroup: Group) => void;
  onDeleteGroup: (onDeleteGroup: number) => void;
  setAllGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  allGroups: Group[];
};

export function GroupChat({
  onUpdateGroup,
  onDeleteGroup,
  setAllGroups,
  allGroups,
}: GroupUserProps) {
  const { selectedGroup, setSelectedGroup } = useSelectedGroupContext();
  const { loggedInUser } = useLoggedInUserContext();
  const { socket } = useSocketContext();
  const [chatData, setChatData] = useState([]);
  const [groupUser, setGroupUsers] = useState<User[]>([]);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isAddMember, setIsAddMember] = useState<boolean>(false);
  const [isRemoveMember, setIsRemoveMember] = useState<boolean>(false);
  const [isViewMember, setIsViewMember] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedGroup) {
      if (allGroups.length > 0) setSelectedGroup(allGroups[0]);
      else return;
    }
  }, [allGroups]);

  useEffect(() => {
    const group_id: number = Number(selectedGroup?.group_id);
    async function FetchUserChatData() {
      try {
        if (group_id) {
          const groupUserData = await getGroupUsers(group_id);
          const allUsers = groupUserData.data.data.map(
            (item: { user: User }) => item.user
          );
          setGroupUsers(allUsers);
          if (allUsers.length > 0) {
            const response = await getGroupChat(group_id);
            if (response.data.data.length > 0) {
              setChatData(response.data.data);
            } else {
              setChatData([]);
            }
          }
        }
      } catch (error) {
        setChatData([]);
        throw error;
      }
    }
    FetchUserChatData();
  }, [selectedGroup]);

  const removeMember = (user_id: number) => {
    setGroupUsers((prevUser) =>
      prevUser.filter((user) => user.user_id != user_id)
    );
    toast.success("User removed successfully");
  };

  const addUSer = (user: User) => {
    setGroupUsers((prev) => [...prev, user]);
    toast.success("team member added");
  };

  const deleteGroup = async () => {
    const isDelete = confirm(
      `Are you sure you want to delete ${selectedGroup?.group_name} group ?`
    );
    if (isDelete) {
      const response = await deleteGroupData(Number(selectedGroup?.group_id));
      onDeleteGroup(response.data.data.group_id);
      setSelectedGroup(null);
      toast.success("Group deleted successfully");
    }
  };

  const leftGroup = async () => {
    const left: boolean = confirm(
      "Are you sure you want to left from the group"
    );
    if (left) {
      const group_id = selectedGroup?.group_id as number;
      const use_name = loggedInUser?.first_name + " " + loggedInUser?.last_name;
      await userLeftGroup(group_id);
      setSelectedGroup(null);
      onDeleteGroup(group_id);
      socket!.emit(
        "send group message",
        loggedInUser?.user_id,
        group_id,
        `${use_name} left group`,
        selectedGroup?.group_name,
        loggedInUser?.user_id
      );
      toast.success("User left from the group successfully");
    } else {
      return;
    }
  };

  async function downloadChat(): Promise<void> {
    try {
      setLoading(true);
      const group_id = selectedGroup?.group_id as number;
      const response = await groupChatDownload(group_id);
      toast.success(response.data.message);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-white flex-shrink-0">
        {selectedGroup ? (
          <>
            <div className="flex items-center space-x-3">
              <img
                src={selectedGroup.profile_photo}
                alt={selectedGroup.group_name}
                className="w-14 h-14 rounded-full ring-2 ring-red-200 object-cover flex-shrink-0"
              />
              <span className="text-lg font-medium">
                {selectedGroup.group_name}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xl">
              <button
                onClick={() => setIsEditOpen(true)}
                className="text-green-800 border p-2 rounded-sm hover:bg-green-100 transition"
                aria-label="Edit Group"
                type="button"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => setIsAddMember(true)}
                className="text-green-800 border p-2 rounded-sm hover:bg-green-100 transition"
                aria-label="Add Member"
                type="button"
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </button>
              <button
                onClick={() => setIsRemoveMember(true)}
                className="text-green-800 border p-2 rounded-sm hover:bg-green-100 transition"
                aria-label="Remove Member"
                type="button"
              >
                <FontAwesomeIcon icon={faUserMinus} />
              </button>
              {loading ? (
                <span>
                  <LoaderComponent />
                </span>
              ) : (
                <button
                  onClick={downloadChat}
                  className="text-green-800 border p-2 rounded-sm hover:bg-green-100 transition"
                  aria-label="Download Chat"
                  type="button"
                >
                  <FontAwesomeIcon icon={faFilePdf} />
                </button>
              )}
              <button
                onClick={leftGroup}
                className="text-red-800 border p-2 rounded-sm hover:bg-red-100 transition"
                aria-label="Leave Group"
                type="button"
              >
                <FontAwesomeIcon icon={faDoorOpen} />
              </button>
              <button
                onClick={deleteGroup}
                className="text-red-800 border p-2 rounded-sm hover:bg-red-100 transition"
                aria-label="Delete Group"
                type="button"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </>
        ) : (
          <span className="w-full mx-auto p-3 border rounded-full bg-white text-center underline">
            Select or Create Group to start chatting
          </span>
        )}
      </div>

      {selectedGroup && (
        <ShowGroupChat
          ChatData={chatData}
          allUsers={groupUser}
          setAllGroups={setAllGroups}
          allGroups={allGroups}
        />
      )}

      {isEditOpen && (
        <EditGroupModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onGroupUpdated={onUpdateGroup}
        />
      )}
      {isAddMember && (
        <AddMember
          isOpen={isAddMember}
          onClose={() => setIsAddMember(false)}
          addUSer={addUSer}
        />
      )}
      {isRemoveMember && (
        <RemoveMember
          isOpen={isRemoveMember}
          onClose={() => setIsRemoveMember(false)}
          groupUsers={groupUser}
          removeMember={removeMember}
        />
      )}
      {isViewMember && (
        <ViewGroupMember
          isOpen={isViewMember}
          onClose={() => setIsViewMember(false)}
          groupUsers={groupUser}
        />
      )}

      {loading && (
        <span className="flex justify-center items-center mt-4 space-x-2">
          <LoaderComponent />
          <span>Loading...</span>
        </span>
      )}
    </div>
  );
}
