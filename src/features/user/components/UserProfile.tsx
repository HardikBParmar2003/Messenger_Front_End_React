import { useEffect, useState } from "react";
import { individualUser } from "@/api/handler";
import { LoaderComponent } from "@/components/Loader/Loader";
import type { User } from "@/interface/interface";

export interface userProfileTypes {
  onClose: () => void;
  userId: number;
}

export function UserProfile({ onClose, userId }: userProfileTypes) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await individualUser(userId);
        setUser(response.data?.data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          aria-label="Close modal"
        >
          ×
        </button>

        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <LoaderComponent />
            <span>Loading...</span>
          </div>
        ) : user ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">User Profile</h2>
            <div className="flex justify-center mb-4">
              <img
                src={user.profile_photo}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full ring-2 ring-red-200"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={user.first_name}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={user.last_name}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">User not found</p>
        )}
      </div>
    </div>
  );
}
