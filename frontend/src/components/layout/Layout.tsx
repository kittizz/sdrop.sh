import React, { ReactNode } from 'react'
import Head from 'next/head'

interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'SDROP - Secure File Sharing',
  description = 'A modern, secure file sharing platform with password protection'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-dark text-white">
        {children}
      </main>
    </>
  )
}

export default Layout