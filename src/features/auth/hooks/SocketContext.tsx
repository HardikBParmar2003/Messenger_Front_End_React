import React, { createContext, useContext, useEffect, useState } from "react";
import { useLoggedInUserContext } from "@/features/user/hooks";
import { io, Socket } from "socket.io-client";

interface socketType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<socketType>({
  socket: null,
  isConnected: false,
});

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loggedInUser } = useLoggedInUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!loggedInUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io("http://localhost:4000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected to socket", newSocket.id);
      setIsConnected(false);
    });
    return () => {
      if (newSocket.connected) newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [loggedInUser]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Error while using  socket context");
  }
  return context;
}
