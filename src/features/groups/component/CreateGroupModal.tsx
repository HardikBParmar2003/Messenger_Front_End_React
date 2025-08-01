import { createGroup } from "@/api/group.api";
import type { CloseModelProps } from "@/interface/interface";
import { useState } from "react";
import { toast } from "react-toastify";

function CreateGroupModal({ closeModal, addNewGroup }: CloseModelProps) {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    if (!groupName.trim()) {
      return;
    }
    formData.append("groupName", groupName);
    const response = await createGroup(formData);
    toast.success(response.data.message);
    setGroupName("");
    addNewGroup(response.data.data);
    closeModal();
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <button
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
        onClick={closeModal}
        aria-label="Close modal"
      >
        <span className="text-xl font-semibold leading-none">&times;</span>
      </button>

      <h2 className="text-2xl font-semibold mb-4 mt-4 ml-10 text-gray-800">
        Create New Group
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-gray-700 font-medium mb-2"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter group name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 icursor-ponter"
        >
          Create Group
        </button>
      </form>
    </div>
  );
}

export default CreateGroupModal;
