import { getEmail, verifyOtp } from "@/api/handler";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      const user_email = await getEmail();
      if (!user_email.data.data) {
        console.log("ghvdjhfds", user_email.data.data);
        toast.error("First verify email");
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    }
    verifyEmail();
  }, []);

  const [otp, setOtp] = useState<string>("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("otp", otp);
    await verifyOtp(formData);
    alert("OTP successfuly verified complete sign up process within 5 minutes");
    navigate("/auth/signup");
  };
  return (
    <div className="bg--200 flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <p className="text-2xl font-bold mb-5 text-center">Verify OTP:</p>
        <div>
          <label htmlFor="otp">OTP::</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOtp(e.target.value)
            }
            required
          />
        </div>

        <button type="submit">Send Otp</button>
      </form>
    </div>
  );
}
