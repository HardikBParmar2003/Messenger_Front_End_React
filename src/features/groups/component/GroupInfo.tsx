import { getGroupData, individualUser } from "@/api/handler";
import { LoaderComponent } from "@/components/Loader/Loader";
import type { Group } from "@/interface/interface";
import { useEffect, useState } from "react";
import { useLoggedInUserContext } from "@/features/user/hooks";

export interface userProfileTypes {
  onClose: () => void;
  group_id: number;
}
export function GroupInfo({ onClose, group_id }: userProfileTypes) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);
  const { loggedInUser } = useLoggedInUserContext();
  useEffect(() => {
    async function isGroup() {
      try {
        setLoading(true);
        const response = await getGroupData(group_id);
        if (response.data.data) {
          const newDate = new Date(response.data.data.createdAt);
          setDate(
            `${newDate.getDate()} - ${
              newDate.getMonth() + 1
            } -${newDate.getFullYear()}`
          );
          if (response.data.data.user_id == loggedInUser?.user_id) {
            setAdmin(`${loggedInUser?.first_name} ${loggedInUser?.last_name}`);
          } else {
            const user = await individualUser(response.data.data.user_id);
            setAdmin(
              `${user.data.data.first_name} ${user.data.data.last_name}`
            );
          }
          setGroup(response.data.data);
        } else {
          setGroup(null);
        }
      } catch (error) {
        setGroup(null);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
    isGroup();
  }, [group_id]);
  return (
    <div className="fixed inset-0 bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative ">
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
        ) : group ? (
          <>
            <h2 className="text-xl font-bold text-center mb-4">
              Group Profile
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={group.profile_photo}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full ring-2 ring-red-200"
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1 text-left">
                  Group Name:
                </label>
                <input
                  type="text"
                  value={group.group_name}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1 text-left">
                  Admin Name:
                </label>
                <input
                  type="text"
                  value={admin as string}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1 text-left">
                  Created Date:
                </label>
                <input
                  type="email"
                  value={date as string}
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
          <p className="text-center text-red-500">Group not found</p>
        )}
      </div>
    </div>
  );
}