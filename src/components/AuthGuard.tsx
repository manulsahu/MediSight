
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  requireAuth: boolean;
  requireDoctor?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  requireAuth, 
  requireDoctor = false 
}) => {
  const { user, loading, isDoctor } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/signin" />;
  }

  if (requireDoctor && !isDoctor) {
    return <Navigate to="/patient/dashboard" />;
  }

  if (!requireAuth && user) {
    if (isDoctor) {
      return <Navigate to="/doctor/dashboard" />;
    }
    return <Navigate to="/patient/dashboard" />;
  }

  return <Outlet />;
};

export default AuthGuard;
