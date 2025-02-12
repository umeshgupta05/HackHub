
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import AuthLayout from './AuthLayout';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRegister = async (e: React.FormEvent) => {
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
      title="Create Account"
      subtitle="Join our community of innovators"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            type="text"
            placeholder="Full Name"
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
            type="email"
            placeholder="Email"
            className="w-full"
            required
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <Link 
            to="/auth/login"
            className="text-sm text-gray-600 hover:text-primary transition-colors"
          >
            Already have an account?
          </Link>
          <Button type="submit">
            Register
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default Register;
