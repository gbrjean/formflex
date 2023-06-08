"use client"

import css from "@styles/login.module.scss"
import Image from 'next/image';
import GoogleLogo from "@public/assets/icons/search.png"
import { useAuth } from "@context/AuthContext";

const Login = () => {

  const { login } = useAuth()

  return (
    <div className={css.section}>
      <div className={css.wrapper}>
        <h1 className={css.h1}>Login</h1>
        <button className="btn btn-gray" onClick={login}>
          <Image 
            src={GoogleLogo} 
            width={22}
            height={22}
            alt=""
          />  
          Sign In with Google</button>
      </div>
    </div>
  )
}

export default Login