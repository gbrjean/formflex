import { AuthProvider } from "@context/AuthContext"
import { ProtectedRoutes } from "@utils/ProtectedRoutes"

import "@styles/global.scss"
import 'react-toastify/dist/ReactToastify.min.css';

export const metadata = {
  title: "Formflex Creation",
  description: "Formflex app"
}

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <html lang="en">

      <body>
        <AuthProvider>
          <ProtectedRoutes>

            <main className="app">
              {children}
            </main>

          </ProtectedRoutes>
        </AuthProvider>
      </body>
        
    </html>
  )
}

export default RootLayout