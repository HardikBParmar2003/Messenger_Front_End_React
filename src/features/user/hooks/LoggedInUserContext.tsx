import { getToken, individualUser } from "@/api/handler";
import type { loggedInUserType, User } from "@/interface/interface";
import { createContext, useContext, useEffect, useState } from "react";

const LoggedInUserContext = createContext<loggedInUserType | undefined>(
  undefined
);

export function LoggedInUserContextProvider({ children }: any) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function isUSer() {
      try {
        const token = await getToken();
        if (token.data.data) {
          const response = await individualUser();
          if (response.data.data) {
            setLoggedInUser(response.data.data);
          } else {
            setLoggedInUser(null);
          }
        }
      } catch (error) {
        setLoggedInUser(null);
      } finally {
        setLoading(false);
      }
    }
    isUSer();
  }, []);

  return (
    <LoggedInUserContext.Provider
      value={{ loggedInUser, setLoggedInUser, loading }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
}

export function useLoggedInUserContext() {
  const context = useContext(LoggedInUserContext);
  if (!context) {
    throw new Error("Error while useing use selectd user context");
  }
  return context;
}
