import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define route patterns for each role
const ROLE_ROUTES = {
  student: [
    '/dashboard/student',
    '/dashboard/student/**',
  ],
  admin: [
    '/dashboard/admin',
    '/dashboard/admin/**',
  ],
  vendor: [
    '/dashboard/vendor',
    '/dashboard/vendor/**',
  ],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/category/**',
  '/help',
  '/terms',
  '/privacy',
];

// Helper function to check if a path matches any pattern
function matchesPatterns(path, patterns) {
  return patterns.some(pattern => {
    if (pattern.endsWith('/**')) {
      const basePath = pattern.slice(0, -3);
      return path === basePath || path.startsWith(basePath + '/');
    }
    return path === pattern;
  });
}

// Helper function to get user data from JWT access token
async function getUserFromRequest(request) {
  try {
    // Get access token from cookies
    const accessTokenCookie = request.cookies.get('access_token');
    
    if (!accessTokenCookie) {
      console.log('No access token found in cookies');
      return null;
    }

    const token = accessTokenCookie.value;
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

    if (!JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET environment variable is not set');
      return null;
    }

    // Convert the secret to a Uint8Array for jose
    const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
    // Most backends use HS256 algorithm by default
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    });
    
    // Return user data from the decoded token
    return {
      id: payload.id || payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      // Add any other fields that your JWT contains
    };

  } catch (error) {
    if (error.code === 'ERR_JWT_INVALID') {
      console.log('Invalid JWT token');
    } else if (error.code === 'ERR_JWT_EXPIRED') {
      console.log('JWT token expired');
    } else {
      console.error('Error decoding JWT token:', error);
    }
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  if (matchesPatterns(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Get user data
  const user = await getUserFromRequest(request);

  // If no user and trying to access protected route, redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = user.role?.toLowerCase();

  // Check if user is trying to access a dashboard route
  if (pathname.startsWith('/dashboard/')) {
    // If user is accessing their own dashboard area, allow
    if (matchesPatterns(pathname, ROLE_ROUTES[userRole] || [])) {
      return NextResponse.next();
    }

    // If user is trying to access another role's dashboard, redirect to their dashboard
    const redirectMap = {
      student: '/dashboard/student',
      admin: '/dashboard/admin',
      vendor: '/dashboard/vendor',
    };

    const userDashboard = redirectMap[userRole];
    if (userDashboard) {
      return NextResponse.redirect(new URL(userDashboard, request.url));
    }

    // If role is not recognized, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For all other protected routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
