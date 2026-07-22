"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface RegisterFormProps {
  onSubmit?: (data: {
    username: string;
    displayName: string;
    email: string;
    password: string;
  }) => Promise<void> | void;

  loading?: boolean;
}

export default function RegisterForm({
  onSubmit,
  loading = false,
}: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.register({username, displayName, email, password,});
      console.log("Đăng ký thành công:", response);
      login(response.data.access_token, response.data.user);

      router.refresh(); 
      router.push("/");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Username
        </label>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Display Name
        </label>

        <Input
          placeholder="Display Name"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
          required
        />
      </div>

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
        {loading
          ? "Creating account..."
          : "Register"}
      </Button>
    </form>
  );
}