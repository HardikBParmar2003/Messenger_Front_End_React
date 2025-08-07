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
import { GroupInfo } from "./GroupInfo";
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
  const [modal, setModal] = useState<boolean>(false);
  const [groupid, setGroupId] = useState<number | null>(null);

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
        `${use_name}  left group`,
        selectedGroup?.group_name,
        loggedInUser?.user_id
      );
      toast.success("User left from the group successfuly");
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
      <div
        className={`flex m-1 transition duration-300  ${
          isEditOpen || isAddMember || isRemoveMember
            ? "blur-xs pointer-events-none"
            : ""
        }`}
      >
        {selectedGroup ? (
          <>
            <img
              src={selectedGroup?.profile_photo}
              className="user-profile-image w-[60px] h-[60px] rounded-full ring-2 ring-red-200 sm:w-[50px] sm:h-[50px] cursor-pointer"
              key={selectedGroup?.group_id}
              onClick={() => {
                setModal(true);
                setGroupId(selectedGroup?.group_id);
              }}
            />
            {loggedInUser?.user_id === selectedGroup.user_id ? (
              <div className="flex justify-between w-[80%] sm:w-full">
                <span className="text-xl m-[15px] sm:m-3">
                  {selectedGroup?.group_name}
                </span>
                <div className="flex justify-end m-3 space-x-4 text-lg sm:space-x-2">
                  <button>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-green-800 border p-1.75 hover:cursor-pointer rounded-sm"
                      onClick={() => setIsEditOpen(true)}
                    />
                  </button>
                  <button onClick={() => setIsAddMember(true)}>
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      className="text-green-800 border p-1.5 hover:cursor-pointer rounded-sm"
                    />
                  </button>
                  <button onClick={() => setIsRemoveMember(true)}>
                    <FontAwesomeIcon
                      icon={faUserMinus}
                      className="text-green-800 border p-1.5 hover:cursor-pointer rounded-sm"
                    />
                  </button>
                  {loading ? (
                    <LoaderComponent />
                  ) : (
                    <button onClick={downloadChat}>
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="text-green-800 border p-1.5 hover:cursor-pointer rounded-sm"
                      />
                    </button>
                  )}

                  <button onClick={leftGroup}>
                    <FontAwesomeIcon
                      icon={faDoorOpen}
                      className="text-red-800 border p-1.5 hover:cursor-pointer rounded-sm"
                    />
                  </button>

                  <button onClick={deleteGroup}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-800 border p-1.5 hover:cursor-pointer rounded-sm "
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex w-[80%] justify-between sm:w-full">
                <span className="text-xl m-[15px] sm:m-3">
                  {selectedGroup?.group_name}
                </span>
                <div className="flex w-[23%] justify-between bg-amber-5000 text-lg p-2">
                  <button onClick={() => setIsViewMember(true)}>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-green-800 border p-1.5 hover:cursor-pointer rounded-sm"
                    />
                  </button>
                  {loading ? (
                    <span>
                      <LoaderComponent />
                    </span>
                  ) : (
                    <button onClick={downloadChat}>
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="text-green-800 border p-1.5 hover:cursor-pointer rounded-sm"
                      />
                    </button>
                  )}

                  <button onClick={leftGroup}>
                    <FontAwesomeIcon
                      icon={faDoorOpen}
                      className="text-red-800 border p-1.5 hover:cursor-pointer rounded-sm"
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <span className="w-[85%] mx-auto p-1.5 border rounded-4xl bg-white underline sm:w-full sm:text-center">
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
        <span>
          {" "}
          <LoaderComponent />
          Loading...
        </span>
      )}

      {modal && <GroupInfo onClose={onClose} group_id={Number(groupid)} />}
    </>
  );
}