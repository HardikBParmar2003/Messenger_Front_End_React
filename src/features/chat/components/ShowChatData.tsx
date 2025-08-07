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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocketContext();

  const [allMessages, setAllMessages] = useState<Chat[]>(ChatData || []);

  // Group messages by date string "DD - MM - YYYY"
  const groupChatByDate = useMemo(() => {
    const grouped: Record<string, Chat[]> = {};
    allMessages.forEach((chat) => {
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
    const message = inputMessageRef.current?.value.trim();
    if (!message || !socket || !loggedInUser || !selectedUser) return;

    const sender_id = loggedInUser.user_id;
    const receiver_id = selectedUser.user_id;
    const sender_name = `${loggedInUser.first_name} ${loggedInUser.last_name}`;

    socket.emit("send message", sender_id, receiver_id, message, sender_name);
    inputMessageRef.current!.value = "";
  }

  useEffect(() => {
    if (!socket) return;

    function onMessageReceived(data: Chat, sender: string) {
      if (loggedInUser?.user_id === data.receiver_id) {
        sendNotification(`New message from ${sender}!`, {
          body: `Message: ${data.message}`,
          icon: "/images.jpeg",
        });
      }

      const isRelevantMessage =
        (data.sender_id === selectedUser?.user_id &&
          data.receiver_id === loggedInUser?.user_id) ||
        (data.receiver_id === selectedUser?.user_id &&
          data.sender_id === loggedInUser?.user_id);

      if (isRelevantMessage) {
        setAllMessages((prev) => [...prev, data]);
      }

      setUsers((prev) => {
        let otherUserId: number | null = null;

        if (data.sender_id === loggedInUser?.user_id) {
          otherUserId = data.receiver_id;
        } else if (data.receiver_id === loggedInUser?.user_id) {
          otherUserId = data.sender_id;
        } else {
          return prev;
        }

        const updatedUsers = prev.map((user) =>
          user.user_id === otherUserId
            ? { ...user, lastMessageAt: data.createdAt }
            : user
        );

        updatedUsers.sort(
          (a, b) =>
            new Date(b.lastMessageAt!).getTime() -
            new Date(a.lastMessageAt!).getTime()
        );

        return updatedUsers;
      });
    }

    socket.on("send message back", onMessageReceived);
    return () => {
      socket.off("send message back", onMessageReceived);
    };
  }, [socket, selectedUser, loggedInUser, sendNotification, setUsers]);

  // Update messages when ChatData prop changes
  useEffect(() => {
    if (ChatData) {
      setAllMessages(ChatData);
    }
  }, [ChatData]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages]);

  // return (
  //   <div className="flex flex-col h-[91%] ">
  //     <div
  //       ref={chatContainerRef}
  //       className="flex-1 p-6 bg-gray-100 overflow-y-auto"
  //       aria-live="polite"
  //       aria-label="Chat messages"
  //     >
  //       {Object.entries(groupChatByDate).map(([date, chats]) => (
  //         <div key={date}>
  //           <span className="block w-1/6 text-center mb-4 p-1 bg-gray-300 rounded-md mx-auto font-semibold">
  //             {date}
  //           </span>
  //           {chats.map((msg, idx) => {
  //             const isSender = msg.sender_id === loggedInUser?.user_id;
  //             const msgDate = new Date(msg.createdAt);
  //             const formattedTime = msgDate.toLocaleTimeString([], {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             });

  //             return (
  //               <div
  //                 key={idx}
  //                 className={`flex mb-4 w-1/5 rounded-md ${
  //                   isSender ? "bg-green-100 ml-auto" : "bg-white mr-auto"
  //                 }`}
  //               >
  //                 <div className="w-full m-2 text-left break-words">
  //                   {msg.message}
  //                   <div className="text-xs text-gray-500 mt-1 text-right">
  //                     {formattedTime}
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       ))}
  //     </div>

  //     <div className="bg-gray-300 p-2 mt-1 flex items-center rounded-xl">
  //       <input
  //         type="text"
  //         placeholder="ENTER MESSAGE"
  //         className="
  //   flex-grow  border border-gray-800 bg-white
  //   focus:outline-none
  //   focus:ring-2 focus:ring-red-400
  //   focus:ring-offset-0
  //   focus:ring-inset
  //   transition
  // "
  //         ref={inputMessageRef}
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter") sendMessage();
  //         }}
  //         aria-label="Type a message"
  //       />
  //       <button
  //         className="flex items-center justify-center bg-gray-200 p-3 rounded-full min-w-[48px] hover:bg-green-400 transition-colors duration-300"
  //         onClick={sendMessage}
  //         aria-label="Send Message"
  //       >
  //         <FontAwesomeIcon
  //           icon={faPaperPlane}
  //           className="text-green-800 hover:text-black transition-colors duration-300"
  //         />
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex flex-col h-[91%] ">
      <div
        ref={chatContainerRef}
        className="flex-1 p-6 bg-gray-100 overflow-y-auto"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {Object.entries(groupChatByDate).map(([date, chats]) => (
          <div key={date}>
            <span className="block w-1/6 text-center mb-4 p-1 bg-gray-300 rounded-md mx-auto font-semibold">
              {date}
            </span>
            {chats.map((msg, idx) => {
              const isSender = msg.sender_id === loggedInUser?.user_id;
              const msgDate = new Date(msg.createdAt);
              const formattedTime = msgDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={idx}>
                  <div
                    className={`flex mb-4 m-2 p-2 break-words rounded-xl w-fit max-w-[80%] sm:max-w-[70%] md:max-w-[60%]
                              ${
                                isSender
                                  ? "bg-green-100 ml-auto text-left"
                                  : "bg-white mr-auto text-left"
                              }
                            `}
                  >
                    <div className="flex flex-col">
                      <span>{msg.message}</span>
                      <span className="text-xs text-gray-500 mt-1 self-end">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="bg-gray-300 p-2 mt-1 flex items-center rounded-xl">
        <input
          type="text"
          placeholder="ENTER MESSAGE"
          className="
    flex-grow  border border-gray-800 bg-white
    focus:outline-none
    focus:ring-2 focus:ring-red-400
    focus:ring-offset-0
    focus:ring-inset
    transition
  "
          ref={inputMessageRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          aria-label="Type a message"
        />
        <button
          className="bg-green-200 hover:bg-green-300 p-2 rounded-full flex items-center justify-center ml-2"
          onClick={sendMessage}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="text-green-800 p-2" />
        </button>
      </div>
    </div>
  );
}


