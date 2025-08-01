import { updateGroup } from "@/api/group.api";
import { useState, useEffect } from "react";
import { useSelectedGroupContext } from "../hook";
import type { EditGroupProps, Group } from "@/interface/interface";
import { toast } from "react-toastify";
import { useSocketContext } from "@/features/auth/hooks/SocketContext";
export function EditGroupModal({ isOpen, onClose }: EditGroupProps) {
  const { selectedGroup, setSelectedGroup } = useSelectedGroupContext();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState(
    selectedGroup?.group_name as string
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(
    selectedGroup?.profile_photo
  );
  const { socket } = useSocketContext();
  useEffect(() => {
    setGroupName(selectedGroup?.group_name as string);
    setPreview(selectedGroup?.profile_photo);
    setImageFile(null); // reset file on modal open
  }, [selectedGroup]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("group_name", groupName);
      if (imageFile) formData.append("profile", imageFile);

      const response = await updateGroup(
        Number(selectedGroup?.group_id),
        formData
      );
      const groupData: Group = response.data.data;
      setSelectedGroup(groupData);
      onClose();
      socket!.emit("update group", groupData.group_id, groupData);
      toast.success(response.data.message);
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow-md relative">
        <button
          className="absolute  top-1 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className="text-xl font-semibold leading-none">&times;</span>
        </button>
        <h2 className="text-xl font-semibold mt-4 mb-4">Edit Group</h2>

        <label className="block mb-2 text-sm font-medium">Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-full mb-4 ring-2 ring-red-200"
          />
        )}

        <div className="flex justify-end space-x-2">
          {loading ? (
            <span>
              Loading...
              <svg
                aria-hidden="true"
                role="status"
                className="  text-5xl m-[20px] p-1 inline w-5 h-5 me-3 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
            </span>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditGroupModal;
