"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
  }) => Promise<void> | void;

  loading?: boolean;
}

export default function LoginForm({
  onSubmit,
  loading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });
      console.log("Đăng nhập thành công:", response);
      login(response.data.access_token, response.data.user);

      router.refresh(); 
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Email
        </label>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Password
        </label>

        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Login"}
      </Button>
    </form>
  );
}