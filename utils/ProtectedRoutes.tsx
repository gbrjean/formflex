"use client"

import { usePathname, useSearchParams, redirect } from 'next/navigation';

import { useAuth } from "@context/AuthContext"; 

export const ProtectedRoutes = ({children} : {children: React.ReactNode}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = pathname + searchParams.toString();

  const { user } = useAuth()

  if( !user && url !== "/login" ) { redirect('/login') }

  return <>{children}</>;
};