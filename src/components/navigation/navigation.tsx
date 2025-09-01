"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./navigation.module.css"
import { usePathname } from "next/navigation";
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
    index: number, 
    pathname: string,
    onClick?: () => void) {
    return (
      <li key={index}>
        <Link href={page.path} onClick={onClick}>
        <span
          className={`${page.title === "Login/Signup" ? styles["nav-list-button"] : styles["nav-list-link"]} 
                      ${
                        page.path === "/"
                          ? pathname === page.path
                            ? styles["active"]
                            : ""
                          : pathname.startsWith(page.path)
                          ? styles["active"]
                          : ""}`
            }>
          {page.title} </span>
        </Link>
      </li>
    );
  }

  type HamburgerProps = {
    isOpen: boolean;
    toggleMenu: () => void;
  };

  function Hamburger({ isOpen, toggleMenu }: HamburgerProps) { 
    return (
      <button
        className="flex sm:hidden flex-col justify-center items-start w-9 h-7 p-1.5 space-y-1 rounded-sm hover:bg-primary active:bg-primary"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
      >
        <span
          className={`w-5 bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}
          style={{ height: '3px' }}
        />

        <span className={`w-2 bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? "opacity-0" : ""}`}
         style={{ height: '3px' }}/> 
        
        <span
          className={`w-4 bg-white rounded-full transition-all duration-300 ease-in-out ${isOpen ? "w-5 -rotate-45 -translate-y-1.5" : ""}`}
          style={{ height: '3px' }}
        />

      </button>
    );
  }
  
  export function Navigation() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
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
      <nav className={`sticky top-0 z-20 ${styles.navbg}`}>
        <div className="container flex justify-between">
          {/* Visible on mobile */}
          <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMenu}/>
          <ul
          className={
            `flex sm:hidden flex-col w-full absolute top-full left-0 items-center bg-primary py-2 px-3 space-y-2 text-sm border-b border-secondary
            ${!isMenuOpen ? 'hidden' : ''}`
          }>
            {filteredPages.map((page, index) =>
            processPage(page, index, pathname, closeMenu)
          )}
          </ul>

          {/* Hidden on mobile */}
          <ul className={`hidden sm:flex ${styles.navlist}`}>
            {filteredPages.map((page, index) => processPage(page, index, pathname))}
          </ul>
          
        </div>
      </nav>
    );
}