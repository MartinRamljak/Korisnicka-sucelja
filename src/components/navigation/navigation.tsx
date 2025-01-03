"use client";

import Link from "next/link";
import styles from "./navigation.module.css"
import { usePathname } from "next/navigation";

type Page = {
    title: string;
    path: `/${string}`;
  };
  
  // We hardcode pages here, but you could get this information from some external source (e.g. CMS, DB, config file, etc).
  const pages: Page[] = [
    { title: "Home", path: "/" },
    {
      title: "Collections",
      path: "/collections",
    },
    {
      title: "Reviews",
      path: "/reviews",
    },
    {
      title: "Discussions",
      path: "/discussions",
    },
    {
      title: "Login/Signup",
      path: "/user_profile",
    },
  ];
  
  function processPage(page: Page, index: number, pathname: string) {
    return (
      <li key={index}>
        <Link 
          href={page.path} 
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
          {page.title}
        </Link>
      </li>
    );
  }
  
  export function Navigation() {
    const pathname = usePathname();
    return (
      <nav className={styles["nav-bg"]}>
        <ul className={styles["nav-list"]}>
          {pages.map((page, index) => processPage(page, index, pathname))}
        </ul>
    </nav>
    );
}