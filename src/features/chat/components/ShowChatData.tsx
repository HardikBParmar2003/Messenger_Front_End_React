import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { useLoggedInUserContext } from "@/features/user/hooks/index";
import { useSelectedUserContext } from "../hooks/index";
import { useNotifictionContext } from "@/features/auth/hooks/NotificationFunction";
import type { Chat, ChatDataTypeProps } from "@/interface/interface";
import { useSocketContext } from "@/features/auth/hooks/SocketContext";

export function ShowChatData({ ChatData, setUsers }: ChatDataTypeProps) {
  const { loggedInUser } = useLoggedInUserContext();
  const { selectedUser } = useSelectedUserContext();
  const { sendNotification } = useNotifictionContext();
  const inputMessageRef = useRef<HTMLInputElement>(null);
  const [allMessages, setAllMessages] = useState<Chat[]>(ChatData || []);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { socket } = useSocketContext();

  const groupChatByDate = useMemo(() => {
    const grouped: Record<string, Chat[]> = {};
    allMessages?.map((chat) => {
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
      return;
    } else {
      const message: string = inputMessageRef.current.value.trim();
      const sender_id: number = Number(loggedInUser?.user_id);
      const receiver_id: number = Number(selectedUser?.user_id);
      const sender_name = ((loggedInUser?.first_name as string) +
        " " +
        loggedInUser?.last_name) as string;
      socket.emit("send message", sender_id, receiver_id, message, sender_name);
      inputMessageRef.current.value = "";
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.on("send message back", async (data: Chat, sender: string) => {
      if (loggedInUser?.user_id == data.receiver_id) {
        sendNotification(`New message from ${sender}!!!`, {
          body: `Message : ${data.message}`,
          icon: "/images.jpeg",
        });
      }
      if (
        (data.sender_id === selectedUser?.user_id &&
          data.receiver_id === loggedInUser?.user_id) ||
        (data.receiver_id === selectedUser?.user_id &&
          data.sender_id === loggedInUser?.user_id)
      ) {
        setAllMessages((prev) => [...prev, data]);
      }

      setUsers((prev) => {
        let othUserId: number | null = null;
        if (data.sender_id == loggedInUser?.user_id) {
          othUserId = data.receiver_id;
        } else if (data.receiver_id == loggedInUser?.user_id) {
          othUserId = data.sender_id;
        } else {
          return prev;
        }

        const updatedUsers = prev.map((user) => {
          if (user.user_id == othUserId) {
            return {
              ...user,
              lastMessageAt: data.createdAt,
            };
          }
          return user;
        });
        updatedUsers.sort(
          (a, b) =>
            new Date(b.lastMessageAt!).getTime() -
            new Date(a.lastMessageAt!).getTime()
        );
        return updatedUsers;
      });
    });

    return () => {
      socket.off("send message back");
    };
  }, [socket, selectedUser, loggedInUser]);

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

  return (
    <div className="flex flex-col h-[92%] ">
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 bg-gray-100 overflow-y-auto h-["
      >
        {Object.entries(groupChatByDate).map(([date, chat]) => (
          <div key={date}>
            <span className="block w-[15%] text-center mb-4  p-0.5 bg-gray-300 rounded-md m-auto ">
              {date}
            </span>
            {chat.map((msg, index) => {
              const isSender = msg.sender_id === loggedInUser?.user_id;
              const newDate: Date = new Date(msg.createdAt);
              const newTime: string =
                newDate.getHours() + ":" + newDate.getMinutes();
              return isSender ? ( // I can also user conditional class name but I have used it once so I practice this
                <div
                  key={index}
                  className="flex mb-4 w-[20%] bg-green-100 ml-auto rounded-md text-left"
                >
                  <div className="w-full m-2 text-left">
                    {msg.message}
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {newTime}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex  mb-4 w-[20%] bg-white mr-auto  rounded-md"
                >
                  <div className="w-full m-2 text-left">
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
      <div className="bg-gray-300 p-1 mt-1 h-auto ">
        <input
          type="text"
          placeholder="ENTER MESSAGE"
          className="w-[85%] mx-auto p-1.5 border rounded-4xl bg-white"
          ref={inputMessageRef}
        />
        <button
          className="bg-red-600-200 p-2.5 ml-4 border rounded-full min-w-[50px] cursor-pointer"
          onClick={sendMessage}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-green-800 " />
        </button>
      </div>
    </div>
  );
}
