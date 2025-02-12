
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from './AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase authentication
    toast({
      title: "Notice",
      description: "Please connect to Supabase to enable authentication.",
      duration: 5000,
    });
  };

  return (
    <AuthLayout 
      title="Welcome Back!"
      subtitle="Login to access your dashboard"
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            type="email"
            placeholder="Email"
            className="w-full"
            required
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            type="password"
            placeholder="Password"
            className="w-full"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <Link 
            to="/auth/register"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Don't have an account?
          </Link>
          <Button type="submit">
            Login
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Login;
