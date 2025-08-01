import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useLoggedInUserContext } from "../hooks";
import { updateUser } from "@/api/handler";
import { toast } from "react-toastify";
import { LoaderComponent } from "@/components/Loader/Loader";

export function UpdateUser() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { loggedInUser, setLoggedInUser } = useLoggedInUserContext();
  const [profile, setProfile] = useState(loggedInUser?.profile_photo);

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(imageUrl);
    } else {
      alert("Upload jpeg, png, or jpg format file...");
    }
  };

  async function updateUserData(data: any) {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      if (data.profile?.length > 0) {
        formData.append("profile", data.profile[0]);
      }
      const response = await updateUser(formData);
      setLoggedInUser(response.data.data);
      toast.success("Profile updated successfully");
      navigate("/home");
    } catch (error) {
      toast.error("Failed to update user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(updateUserData)}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Update Profile</h2>

        <div className="flex justify-center">
          <img
            src={profile}
            className="w-32 h-32 object-cover rounded-full ring-2 ring-red-200"
            alt="Profile"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            {...register("first_name")}
            defaultValue={loggedInUser?.first_name}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            {...register("last_name")}
            defaultValue={loggedInUser?.last_name}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            defaultValue={loggedInUser?.email}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Profile Photo</label>
          <input
            type="file"
            {...register("profile")}
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleProfile}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded p-2"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <>
                <LoaderComponent /> &nbsp; Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
