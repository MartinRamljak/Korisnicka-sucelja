'use client'

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

type Page = {
    title: string;
    path: `/${string}`;
  };
  
  const pages: Page[] = [
    { title: "Home", path: "/" },
    {
      title: "Collections",
      path: "/collections",
    },
    {
      title: "Discussions",
      path: "/discussions",
    },
    {
      title: "Login/Signup",
      path: "/login_signup",
    },
    {
      title: "User Profile",
      path: "/user_profile",
    },
  ];

  function processPage(
    page: Page, 
    index: number)
 {
    return (
      <li key={index}>
        <Link href={page.path}>
          <span className='hover:text-primary text-xs md:text-lg duration-300'>{page.title} </span>
        </Link>
      </li>
    );
  }

export function Footer(){
    const [user, setUser] = useState<User | null>(null)
    const [authChecked, setAuthChecked] = useState(false)
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
      const getUser = async () => {
        setLoading(true)
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUser(data.user)
        }
        setAuthChecked(true)
        setLoading(false)
      }

      getUser()
    }, [])
    
    if (!authChecked) return null

    if (loading) {
      return <p>Loading...</p>;
    }

    const filteredPages = user ? pages.filter(page => page.title !== 'Login/Signup') : pages.filter(page => page.title !== 'User Profile')
    return (
        <footer className="flex flex-col justify-center items-center h-20 text-white mt-10">
            {!user && 
              <Link href={'/login_signup'}>
                <button className="bg-primary md:text-2xl py-3 px-5 rounded-2xl mb-4 hover:bg-secondary duration-300 mt-10">Join for more access!</button>
              </Link>
            }
            <div className="flex flex-col lg:flex-row justify-between items-center bg-primary py-2 px-6 w-screen">
                <h2 className="text-black text-l md:text-2xl">Connect on social media</h2>
                <div className="flex space-x-10 pr-5">
                    <Image src="/images/fb.png" alt="Facebook" width={24} height={24} className="w-6 sm:w-8 md:w-10" />
                    <Image src="/images/ig.png" alt="Instagram" width={24} height={24} className="w-6 sm:w-8 md:w-10" />
                    <Image src="/images/x.png" alt="X" width={24} height={24} className="w-6 sm:w-8 md:w-10" />
                    <Image src="/images/yt.png" alt="YouTube" width={24} height={24} className="w-6 sm:w-8 md:w-10" />
                </div>
            </div>
            <div className='flex justify-around bg-black text-white py-2 px-6 w-screen'>
                <ul className="flex space-x-4">
                    {filteredPages.map((page, index) => processPage(page, index))}
                </ul>
            </div>
        </footer>

    );
}