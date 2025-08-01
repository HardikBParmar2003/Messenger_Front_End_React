import { individualUser } from "@/api/handler";
import { LoaderComponent } from "@/components/Loader/Loader";
import type { User } from "@/interface/interface";
import { useEffect, useState } from "react";

export interface userProfileTypes {
  onClose: () => void;
  userId: number;
}
export function UserProfile({ onClose, userId }: userProfileTypes) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function isUSer() {
      try {
        const response = await individualUser(userId);
        if (response.data.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    isUSer();
  }, [userId]);
  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
      {loading ? (
        <span>
          Loading...
          <LoaderComponent />
        </span>
      ) : (
        <div className="bg-white p-6 rounded-lg w-[350px] shadow-md relative">
          <button
            className="absolute  top-1 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="text-xl font-semibold leading-none">&times;</span>
          </button>
          <h2 className="text-xl font-semibold mt-4 mb-4">User Profile</h2>
          <div className="flex justify-center mb-3 border-b-1">
            <img
              src={user?.profile_photo}
              className="rounded-full w-[50%] h-[150px] mb-1 ring-2 ring-red-100"
            />
          </div>
          <div className="text-">
            <label className="block mb-2 text-sm font-medium">First Name</label>
            <input
              type="text"
              value={user?.first_name}
              className="w-full border px-3 py-2 rounded mb-4"
              readOnly
            />

            <label className="block mb-2 text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={user?.last_name}
              className="w-full border px-3 py-2 rounded mb-4"
              readOnly
            />

            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="text"
              value={user?.email}
              className="w-full border px-3 py-2 rounded mb-4"
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
