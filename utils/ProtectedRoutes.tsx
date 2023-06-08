"use client"

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { useAuth } from "@context/AuthContext"; 

export const ProtectedRoutes = ({children} : {children: React.ReactNode}) => {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = pathname + searchParams.toString();

  const { user } = useAuth()
    
  if(user && url === "/login")
    router.back()

  if( !user &&
      (url === "/collections" ||
       url === "/forms" ||
      url === "/creation" )
  ) { router.push('/login') }

  return <>{children}</>;
};