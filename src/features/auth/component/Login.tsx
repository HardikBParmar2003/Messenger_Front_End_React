import React, { useEffect, useRef, useState } from "react";
import "../../../App.css";
import "../../user/style/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "@/features/user/hooks";
import { getToken, logInUser } from "@/api/auth.api";
import { toast } from "react-toastify";
import { ShowPasswordButton } from "@/components/Button/ShowPasswordButton";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUser } = useLoggedInUserContext();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function verifyToken() {
      const token = await getToken();
      if (token.data.data == true) {
        navigate("/home");
      }
    }
    verifyToken()
  }, [navigate]);


  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());
    try {
      const response = await logInUser(formData);
      setLoggedInUser(await response.data.data.userData);
      navigate("/home");
      toast.success("User log in successful");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="bg--200 flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="text-left">
        <h3 className="text-4xl font-bold mb-5 text-center">Log In</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="ml-9">
            Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="w-[70%] ml-10"
            required
          />

          <ShowPasswordButton
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>
        <button type="submit">Log In</button>
        <Link
          to="/auth/newUser"
          className="m-5 bg-blue-100 min-w-50 p-2 rounded-md text-center"
        >
          New User ?
        </Link>
      </form>
    </div>
  );
}

export default Login;
