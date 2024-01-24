"use client"

import { redirect, useRouter } from 'next/navigation';
import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { auth, googleProvider, db } from "@utils/firebase";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";


interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContextDefaults: AuthContextType = {
  user: null,
  login: () => null,
  logout: () => null
}

const AuthContext = createContext<AuthContextType>(AuthContextDefaults)

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children} : {children: ReactNode}){
  const router = useRouter()
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const signInWithGoogle = async () => {
    try{
      await signInWithPopup(auth, googleProvider)
      router.push("/collections")
    } catch(error){
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      redirect('/')
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])


  const contextData = {
    user: currentUser,
    login: signInWithGoogle,
    logout: logout
  }

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  )

}