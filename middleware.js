import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes that require authentication
const protectedRoutes = [
  '/chat',
  '/counselor/dashboard',
  '/counselor/dashboard/chat',
  '/counselor/dashboard/events',
  '/counselor/dashboard/affirmations',
];

// Define counselor-only routes
const counselorRoutes = [
  '/counselor/dashboard',
  '/counselor/dashboard/chat',
  '/counselor/dashboard/events',
  '/counselor/dashboard/affirmations',
];

// Define student-only routes
const studentRoutes = [
  '/',
  '/chat',
];

// Define public routes that don't need redirection
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token using NextAuth's getToken function
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  console.log('Middleware - Current path:', pathname);
  console.log('Middleware - Token exists:', !!token);
  if (token) {
    console.log('Middleware - User type:', token.type);
  }

  // If it's a public route, allow access without token
  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and trying to access login/register pages, redirect to appropriate dashboard
    if (token) {
      if (token.type === 'student') {
        return NextResponse.redirect(new URL('/', request.url));
      } else if (token.type === 'counselor') {
        return NextResponse.redirect(new URL('/counselor/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }
  
  // If there's no token and it's a protected route, redirect to login
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/login', request.url);
    // Add the current path as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If there's a token, check user type and route access
  if (token) {
    const userType = token.type;
    
    // For counselors
    if (userType === 'counselor') {
      // If trying to access student routes or home, redirect to dashboard
      if (pathname === '/' || studentRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/counselor/dashboard', request.url));
      }
      // If already on counselor routes, allow access
      if (counselorRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
      }
    }
    
    // For students
    if (userType === 'student') {
      // If trying to access counselor routes, redirect to home
      if (counselorRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // If on student routes or home, allow access
      if (studentRoutes.includes(pathname) || pathname === '/') {
        return NextResponse.next();
      }
    }
  }
  
  // Allow access to public routes and static files
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/chat/:path*',
    '/counselor/dashboard/:path*',
  ],
}; 