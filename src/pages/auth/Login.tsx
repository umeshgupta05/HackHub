import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import User from "@/models/User"; // Import Mongoose User model
import AuthLayout from "./AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, this would be an API call to your backend
      // which would then use Mongoose to verify credentials.
      // For demonstration, we simulate direct Mongoose interaction (not recommended for client-side).
      const user = await User.findOne({ email: formData.email });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await user.comparePassword(formData.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      // In a real app, you'd receive and store a token (e.g., JWT) here.
      localStorage.setItem('authToken', 'mock-auth-token'); // Placeholder
      localStorage.setItem('userId', user._id.toString()); // Store user ID

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
