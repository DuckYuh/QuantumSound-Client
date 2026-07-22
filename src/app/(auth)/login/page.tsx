import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Login
      </h1>
      <LoginForm />
    </div>
  );
}
