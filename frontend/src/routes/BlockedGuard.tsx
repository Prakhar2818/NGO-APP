import { ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import {
  getIsBlocked,
  setIsBlocked,
  setProfileCompleted,
  setRole,
} from "../utils/token";
import { env } from "../config/env";

interface BlockedGuardProps {
  children: ReactNode;
}

const BlockedGuard: React.FC<BlockedGuardProps> = ({ children }) => {
  const [isBlocked, setIsBlockedState] = useState(getIsBlocked());
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncUserStatus = async () => {
      try {
        const res = await api.get("/auth/me");
        const blocked = Boolean(res.data?.isBlocked);
        const role = res.data?.role;
        const profileCompleted = Boolean(res.data?.profileCompleted);

        setIsBlocked(blocked);
        setProfileCompleted(profileCompleted);
        if (role) setRole(role);

        if (isMounted) {
          setIsBlockedState(blocked);
        }
      } catch {
        // If /auth/me fails, fall back to existing local state
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    syncUserStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return null;
  }

  if (isBlocked) {
    const adminEmail = env.adminContactEmail || "admin@yourdomain.com";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 font-mono">
        <div className="w-full max-w-xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-rose-600 mb-3">
            Account Blocked
          </h1>
          <p className="text-gray-700 mb-6">
            Your account has been blocked. Please contact the admin at{" "}
            <span className="font-semibold text-gray-900">{adminEmail}</span> to
            unblock your account.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BlockedGuard;
