import React, { useEffect, useState } from "react";
import "../../../App.css";
import "../../user/style/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { useLoggedInUserContext } from "@/features/user/hooks";
import { getToken, logInUser } from "@/api/auth.api";
import { getToken, logInUser } from "@/api/auth.api";
import { toast } from "react-toastify";
import { ShowPasswordButton } from "@/components/Button/ShowPasswordButton";
import { AuthWrapper } from "./AuthWrapper";

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
    <AuthWrapper>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-3xl font-bold text-center">Log In</h3>

        <div>
          <label htmlFor="email" className="block mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
          <ShowPasswordButton
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
          Log In
        </button>

        <Link to="/auth/newUser" className="block text-center text-blue-500 mt-2">
          New User?
        </Link>
      </form>
    </AuthWrapper>
  );
}


export default Login;
