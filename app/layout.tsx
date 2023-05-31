
export const metadata = {
  title: "Formflex",
  description: "Formflex app"
}

const RootLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <body>
        {/* //! include header */}
        <main className="app">
          {children}
        </main>
        {/* //! include footer */}

      </body>
    </html>
  )
}

export default RootLayout