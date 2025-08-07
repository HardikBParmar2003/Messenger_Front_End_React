import { sendOtp } from "@/api/handler";
import { LoaderComponent } from "@/components/Loader/Loader";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthWrapper } from "./AuthWrapper";

export function Email() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      await sendOtp(formData);
      toast.success(`OTP sent to ${email}`);
      setTimeout(() => {
        navigate("/auth/verifyOtp");
      }, 3000);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Verify Email</h2>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {loading ? (
          <button
            disabled
            type="button"
            className="w-full flex justify-center items-center bg-gray-500 text-white py-2 rounded-md"
          >
            <LoaderComponent />
            <span className="ml-2">Loading...</span>
          </button>
        ) : (
          <>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md"
            >
              Send OTP
            </button>
            <Link
              to="/auth/login"
              className="block text-center text-blue-500 mt-2"
            >
              Already have an account? Log in
            </Link>
          </>
        )}
      </form>
    </AuthWrapper>
  );
}
