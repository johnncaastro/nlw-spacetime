import { ReactNode } from 'react'
import Head from './head'
import { cookies } from 'next/headers'

import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamJuree,
} from 'next/font/google'

import { Hero } from '@/components/Hero'
import { Profile } from '@/components/Profile'
import { SignIn } from '@/components/SignIn'
import { Copyright } from '@/components/Copyright'
import { MemoriesProvider } from '@/hooks/useMemories'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baiJamJuree = BaiJamJuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-baijamjuree',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has('token')

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <Head />
      <body
        className={`${roboto.variable} ${baiJamJuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <MemoriesProvider>
          <main className="grid min-h-screen grid-cols-2">
            {/* Left */}
            <div className="relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] px-28 py-16 sm:hidden lg:flex lg:flex-col lg:items-start lg:justify-between">
              {/* Blur */}
              <div className="absolute right-0 top-1/2 h-[288px] w-[526px] -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-700 opacity-50 blur-full" />
              {/* Stripes */}
              <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

              {/* SignIn */}
              {isAuthenticated ? <Profile /> : <SignIn />}

              {/* Hero */}
              <Hero />

              {/* Copyright */}
              <Copyright />
            </div>

            {/* Right */}
            <div className="flex max-h-screen flex-col overflow-y-scroll bg-[url(../assets/bg-stars.svg)] sm:w-screen lg:w-full">
              {children}
            </div>
          </main>
        </MemoriesProvider>
      </body>
    </html>
  )
}
