import Header from "@components/Header"
import { AuthProvider } from "@context/AuthContext"
import { ProtectedRoutes } from "@utils/ProtectedRoutes"

import "@styles/global.scss"

export const metadata = {
  title: "Formflex",
  description: "Formflex app"
}

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <html lang="en">

      <body>
        <AuthProvider>
          <ProtectedRoutes>

            <Header />
            <main className="app">
              {children}
            </main>
            {/* //! include footer */}
            
          </ProtectedRoutes>
        </AuthProvider>
      </body>
        
    </html>
  )
}

export default RootLayout