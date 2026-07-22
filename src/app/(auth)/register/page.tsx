import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto mt-20 max-w-md rounded-xl border p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Register
      </h1>
      <RegisterForm />
    </div>
  );
}