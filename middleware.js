import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define protected routes that require authentication
const protectedRoutes = [
  '/chat',
  '/counselor/dashboard',
  '/counselor/dashboard/chat',
  '/counselor/dashboard/events',
  '/counselor/dashboard/affirmations',
  '/screening',
  '/events'
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
  '/screening',
  '/events'
];

// Define public routes that don't need redirection
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password'
];

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Debug: Log the full URL and search params
  console.log('Middleware - Full URL:', request.url);
  console.log('Middleware - Search Params:', Object.fromEntries(searchParams));
  
  // Get the token using NextAuth's getToken function
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Debug: Log token details
  console.log('Middleware - Token:', token ? {
    exists: true,
    type: token.type,
    id: token.id,
    email: token.email
  } : { exists: false });
  
  // Debug: Log environment variables
  console.log('Middleware - NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('Middleware - NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
  
  // If it's a public route, allow access without token
  if (publicRoutes.includes(pathname)) {
    // If user is authenticated and trying to access login/register pages, redirect to appropriate dashboard
    if (token) {
      console.log('Middleware - Redirecting authenticated user from public route');
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
    console.log('Middleware - No token found, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If there's a token, check user type and route access
  if (token) {
    const userType = token.type;
    console.log('Middleware - Checking route access for user type:', userType);
    
    // For counselors
    if (userType === 'counselor') {
      // If trying to access student routes or home, redirect to dashboard
      if (pathname === '/' || studentRoutes.includes(pathname)) {
        console.log('Middleware - Redirecting counselor from student route');
        return NextResponse.redirect(new URL('/counselor/dashboard', request.url));
      }
      // If already on counselor routes, allow access
      if (counselorRoutes.some(route => pathname.startsWith(route))) {
        console.log('Middleware - Allowing counselor access to counselor route');
        return NextResponse.next();
      }
    }
    
    // For students
    if (userType === 'student') {
      // If trying to access counselor routes, redirect to home
      if (counselorRoutes.some(route => pathname.startsWith(route))) {
        console.log('Middleware - Redirecting student from counselor route');
        return NextResponse.redirect(new URL('/', request.url));
      }
      // If on student routes or home, allow access
      if (studentRoutes.includes(pathname) || pathname === '/') {
        console.log('Middleware - Allowing student access to student route');
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
    '/screening/:path*',
    '/events/:path*',
  ],
}; 