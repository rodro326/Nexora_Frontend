import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authApi";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
  
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
  
    try {
      const response = await registerUser({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "customer",
      });
  
      console.log("Registration successful:", response);
  
      alert("Account created successfully!");
  
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
  
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
  
      setError(message);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Nexora
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join Nexora and start shopping today
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-gray-500 hover:text-black"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Register;