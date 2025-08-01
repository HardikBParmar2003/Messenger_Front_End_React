import "../../../App.css";
import "../../user/style/Form.css";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "../schema/SignUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpUser } from "@/api/handler";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AuthWrapper } from "./AuthWrapper";

export type SignUpFormData = z.infer<typeof SignUpSchema>;

export function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  useEffect(() => {
    async function verifyToken() {
      const token = await getToken();
      if (!token.data.data) {
        toast.error("First verify Email");
        navigate("/auth/newUser");
      }
    }
    verifyToken();
  }, [navigate]);
  const onSubmit = async (data: SignUpFormData) => {
    await signUpUser(data);
    navigate("/auth/login");
    toast.success("Successfull login");
  };

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-3xl font-bold mb-3 text-center">Sign Up</h1>

        <div>
          <label>First Name:</label>
          <input className="w-full px-4 py-2 border rounded-md" {...register("first_name")} />
          {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
        </div>

        <div>
          <label>Last Name:</label>
          <input className="w-full px-4 py-2 border rounded-md" {...register("last_name")} />
          {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
        </div>

        <div>
          <label>Password:</label>
          <input type="password" className="w-full px-4 py-2 border rounded-md" {...register("password")} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">
          Sign Up
        </button>
      </form>
    </AuthWrapper>
  );
}
