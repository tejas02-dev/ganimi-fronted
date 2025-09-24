"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

// Define route patterns for each role
const ROLE_ROUTES = {
  student: [
    '/dashboard/student',
  ],
  admin: [
    '/dashboard/admin',
  ],
  vendor: [
    '/dashboard/vendor',
  ],
};

// Routes that require authentication but are accessible to all roles
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/billing',
  '/orders',
  '/help',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/terms',
  '/privacy',
];

// Helper function to check if a path starts with any of the given patterns
function pathStartsWith(path, patterns) {
  return patterns.some(pattern => path.startsWith(pattern));
}

// Helper function to get the appropriate dashboard for a role
function getDashboardForRole(role) {
  const dashboardMap = {
    student: '/dashboard/student',
    admin: '/dashboard/admin',
    vendor: '/dashboard/vendor',
  };
  return dashboardMap[role?.toLowerCase()] || '/dashboard/student';
}

export default function RoleProtection({ children }) {
  const { user, loading, login } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Validate JWT token and sync with AuthContext if user is missing
  useEffect(() => {
    const validateToken = async () => {
      if (!user && !loading) {
        try {
          setIsValidating(true);
          const response = await api.get('/auth/profile');
          if (response.data?.data) {
            login(response.data.data);
          }
        } catch (error) {
          console.log('Token validation failed:', error);
          // Token is invalid or expired, user will be redirected to login
        } finally {
          setIsValidating(false);
        }
      }
    };

    validateToken();
  }, [user, loading, login]);

  useEffect(() => {
    // Don't redirect while still loading or validating
    if (loading || isValidating) return;

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || 
      (route.endsWith('/**') && pathname.startsWith(route.slice(0, -3)))
    );

    // If it's a public route, allow access
    if (isPublicRoute) return;

    // If no user and trying to access protected route, redirect to login
    if (!user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    const userRole = user.role?.toLowerCase();

    // Handle dashboard routes specifically
    if (pathname.startsWith('/dashboard/')) {
      // If user is accessing /dashboard (root), redirect to their specific dashboard
      if (pathname === '/dashboard') {
        router.push(getDashboardForRole(userRole));
        return;
      }

      // Check if user is trying to access a role-specific dashboard
      const allowedDashboards = ROLE_ROUTES[userRole] || [];
      const isAccessingOwnDashboard = allowedDashboards.some(route => 
        pathname.startsWith(route)
      );

      // If user is not accessing their own dashboard area, redirect them
      if (!isAccessingOwnDashboard) {
        const userDashboard = getDashboardForRole(userRole);
        console.warn(`User with role "${userRole}" attempted to access ${pathname}. Redirecting to ${userDashboard}`);
        router.push(userDashboard);
        return;
      }
    }

    // For other protected routes, allow access if user is authenticated
    // You can add more specific role checks here if needed

  }, [user, loading, isValidating, pathname, router]);

  // Show loading state while checking authentication
  if (loading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
}

// Higher-order component for specific role protection
export function withRoleProtection(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toLowerCase())) {
        const userDashboard = getDashboardForRole(user.role);
        router.push(userDashboard);
        return;
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role?.toLowerCase()))) {
      return null;
    }

    return <Component {...props} />;
  };
}
