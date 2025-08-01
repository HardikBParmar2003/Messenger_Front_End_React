import { getEmail, verifyOtp } from "@/api/handler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AuthWrapper } from "./AuthWrapper";

export function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>("");

  useEffect(() => {
    async function verifyEmail() {
      const user_email = await getEmail();
      if (!user_email.data.data) {
        toast.error("First verify email");
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    }
    verifyEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("otp", otp);
    await verifyOtp(formData);
    toast.success("OTP verified. Complete signup within 5 minutes.");
    navigate("/auth/signup");
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

        <div>
          <label htmlFor="otp" className="block mb-1">
            OTP:
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Verify OTP
        </button>
      </form>
    </AuthWrapper>
  );
}
