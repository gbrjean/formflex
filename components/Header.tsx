"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';

const Header = () => {

  const { user, logout } = useAuth()

  let [tooltip, setTooltip] = useState(false)

  const handleTooltip = () => {
    setTooltip((prev) => !prev)
  }

  const router = useRouter();


  return (
    <>
    <header>
      <div className="container">
        <div className="logo">
          FormFlex
        </div>
        <nav>
          <ul className="nav-list">
            <li><Link href="/collections">Collections</Link></li>
            <li><Link href="/forms">Forms</Link></li>
          </ul>
          { user ? (
              <div className="profile" onClick={handleTooltip}>
                <div className={tooltip ? "profile-tooltip --active" : "profile-tooltip"}>
                  <div className="profile-tooltip-content">
                    <span>{user.displayName}</span>
                    <div className="profile-tooltip-link" onClick={logout}>Logout</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile" onClick={() => router.push('/login')}></div>
            )
          }
        </nav>
      </div>
    </header>
    </>
  )
}

export default Header