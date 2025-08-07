import type {
  Group,
  GroupChat,
  GroupChatProps,
  User,
} from "@/interface/interface";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoggedInUserContext } from "@/features/user/hooks";
import { useNotifictionContext } from "@/features/auth/hooks/NotificationFunction";
import { useSelectedGroupContext } from "../hook";
import { useSocketContext } from "@/features/auth/hooks/SocketContext";

export function ShowGroupChat({
  ChatData,
  allUsers,
  setAllGroups,
}: GroupChatProps) {
  const [allMessages, setAllMessages] = useState<GroupChat[]>(ChatData || []);
  const { selectedGroup } = useSelectedGroupContext();
  const { loggedInUser } = useLoggedInUserContext();
  const inputMessageRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [tagUser, setTagUser] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { socket } = useSocketContext();
  const { sendNotification } = useNotifictionContext();

  if (!socket) {
    return;
  }
  const groupChatByDate = useMemo(() => {
    const grouped: Record<string, GroupChat[]> = {};
    const sortedMessages = [...allMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    sortedMessages.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);
      const chatDateKey = `${chatDate.getDate()} - ${
        chatDate.getMonth() + 1
      } - ${chatDate.getFullYear()}`;

      if (!grouped[chatDateKey]) {
        grouped[chatDateKey] = [];
      }
      grouped[chatDateKey].push(chat);
    });
    return grouped;
  }, [allMessages]);

  function sendMessage() {
    if (!inputMessageRef.current?.value.trim() || !socket) {
    } else {
      const message: string = inputMessageRef.current.value.trim();
      const sender_id: number = Number(loggedInUser?.user_id);
      const group_id: number = Number(selectedGroup?.group_id);
      socket.emit(
        "send group message",
        sender_id,
        group_id,
        message,
        selectedGroup?.group_name
      );
      inputMessageRef.current.value = "";
      setInput("");
    }
  }

  const sortGroups = (groups: Group[]) => {
    return groups.sort((a: Group, b: Group) => {
      const timeA = new Date(a.latestMessageTime as string).getTime();
      const timeB = new Date(b.latestMessageTime as string).getTime();
      return timeB - timeA;
    });
  };

  useEffect(() => {
    if (!selectedGroup) return;
    socket.on("send group message back", (data, group_name: string) => {
      console.log("hello");
      if (loggedInUser?.user_id != data.sender.user_id) {
        sendNotification(
          `New message from ${group_name} group by ${
            data.sender.first_name + " " + data.sender.last_name
          }`,
          {
            body: `Message : ${data.message}`,
          }
        );
      }

      if (selectedGroup?.group_id == data.group_id) {
        setAllMessages((prev) => [...prev, data]);
      }
      setAllGroups((prevGroups) => {
        const updatedGroups = prevGroups.map((group) => {
          if (group.group_id === data.group_id) {
            return { ...group, latestMessageTime: data.createdAt };
          }
          return group;
        });

        const sortedGroups = sortGroups(updatedGroups);
        return sortedGroups;
      });
    });
    return () => {
      socket.off("send group message back");
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (ChatData) {
      setAllMessages(ChatData);
    }
  }, [ChatData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages]);

  useEffect(() => {
    const inputValue = input.trim();
    if (!inputValue.trim()) {
      setTagUser([]);
      setShowDropdown(false);
    }
    if (inputValue[inputValue.length - 1] === "@") {
      const userName = inputValue.slice(inputValue.length);
      const users = allUsers.filter((user) =>
        (user.first_name + " " + user.last_name)
          .toLowerCase()
          .includes(userName.toLowerCase())
      );
      setTagUser(users);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [input]);

  console.log("added remove msg is:", groupChatByDate);
  return (
    <div className="flex flex-col h-[88%]">
      <div
        ref={chatContainerRef}
        className="flex-grow p-6 bg-gray-100 overflow-y-auto min-h-0"
      >
        {Object.entries(groupChatByDate)
          .sort(([a], [b]) => {
            const [aDay, aMonth, aYear] = a.split(" - ").map(Number);
            const [bDay, bMonth, bYear] = b.split(" - ").map(Number);
            const dateA = new Date(aYear, aMonth - 1, aDay);
            const dateB = new Date(bYear, bMonth - 1, bDay);
            return dateA.getTime() - dateB.getTime();
          })
          .map(([date, chat]) => (
            <div key={date}>
              <span className="block w-1/6 text-center mb-4 p-1 bg-gray-300 rounded-md mx-auto font-semibold">
                {date}
              </span>
              {chat.map((msg, index) => {
                const isSender = msg.sender.user_id === loggedInUser?.user_id;
                const newDate: Date = new Date(msg.createdAt);
                const newTime: string = `${newDate.getHours()}:${newDate
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;

                if (msg.receiver_id && msg.group_id) {
                  return (
                    <div key={index} className="flex justify-center my-4">
                      <span className="bg-yellow-200 text-sm px-3 py-1 rounded-full shadow">
                        {msg.message}
                      </span>
                    </div>
                  );
                }

                if (isSender) {
                  return (
                    <div
                      key={index}
                      className="flex mb-4 rounded-md justify-end"
                    >
                      <div className="m-2 p-1.5 text-left bg-green-100 max-w-[70%] min-w-[10%] break-words rounded-xl">
                        <span>{msg.message}</span>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {newTime}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="flex mb-4 mr-auto">
                    <div className="max-w-[70%] m-2 p-1 bg-white text-left break-words min-w-[20%] rounded-xl">
                      <div className="flex mb-2">
                        <img
                          src={msg.sender.profile_photo}
                          className="w-5 h-5 rounded-full hover:cursor-pointer ring-2 ring-red-200"
                        />
                        <span className="text-sm ml-1">
                          {msg.sender.first_name} {msg.sender.last_name}
                        </span>
                      </div>
                      {msg.message}
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {newTime}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>

      <div className="bg-gray-300 p-1 flex items-center space-x-3">
        {selectedGroup ? (
          <>
            {showDropdown && (
              <ul className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-gray-300 rounded-md shadow z-50 max-h-40 overflow-y-auto">
                {tagUser.map((user) => (
                  <li
                    key={user.user_id}
                    onClick={() => {
                      setInput(
                        ` ${input} ${user.first_name} ${user.last_name}`
                      );
                      setShowDropdown(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    @{user.first_name + " " + user.last_name}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-3 w-full max-w-full rounded-xl shadow-sm  p-2 bg-gray-300">
              <input
                type="text"
                placeholder="ENTER MESSAGE"
                className="
    flex-grow  border border-gray-300 bg-white
    focus:outline-none
    focus:ring-offset-0
    focus:ring-inset
    transition
  "
                ref={inputMessageRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button
                className="flex items-center justify-center bg-gray-200 p-3 rounded-full min-w-[48px] hover:bg-green-400 transition-colors duration-300"
                onClick={sendMessage}
                aria-label="Send Message"
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="text-green-800 hover:text-black transition-colors duration-300"
                />
              </button>
            </div>
          </>
        ) : (
          <span className="text-gray-500">
            Select a group to start chatting
          </span>
        )}
      </div>
    </div>
  );
}
