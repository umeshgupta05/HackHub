import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import User from "@/models/User"; // Import Mongoose User model
import AuthLayout from "./AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  // More strict email validation regex that requires longer TLDs
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (email: string) => {
    // Basic format check
    if (!emailRegex.test(email)) return false;
    
    // Additional validation for domain
    const [, domain] = email.split('@');
    if (!domain) return false;
    
    // Check domain length and format
    const parts = domain.split('.');
    if (parts.length < 2) return false;
    
    // Ensure domain parts are valid
    return parts.every(part => part.length >= 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submitting
    if (!validateEmail(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address with a proper domain (e.g., example@domain.com)",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: formData.email });
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "An account with this email already exists.",
        });
        setLoading(false);
        return;
      }

      // Create new user using Mongoose model
      await User.create({
        email: formData.email,
        password_hash: formData.password, // Mongoose pre-save hook will hash this
        full_name: formData.fullName, // Assuming full_name is added to the User model if needed
      });

      toast({
        title: "Registration successful!",
        description: "You can now log in with your new account.",
        duration: 3000,
      });
      
      // Clear the form
      setFormData({
        email: "",
        password: "",
        fullName: "",
      });
      
      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an Account" 
      subtitle="Join our community and start collaborating"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            minLength={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address (e.g., you@example.com)"
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
            minLength={6}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
