import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../home/button";
import style from "@/styles/layout.module.css";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest(`.${style.mobileContainer}`)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <header className={cn(style.header, scrolled && style.scrolled)}>
      {/* Desktop Navbar */}
      <div className={cn(style.desktopContainer)}>
        <nav className={style.navbar}>
          <ul className={style.navList}>
            <li>
              <Link href="#" className={style.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#howItWorks" className={style.navLink}>
                How it Works
              </Link>
            </li>
            <li>
              <Link href="#rewards" className={style.navLink}>
                Rewards
              </Link>
            </li>
            <li>
              <Button size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </li>
            <li>
              <Button size="sm">
                <Link href="/login">Login</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <div className={cn(style.mobileContainer)}>
        <div className={style.mobile}>
          <h4>Logo</h4>
          <button
            className={cn(style.burger, open && style.burgerOpen)}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <nav className={cn(style.mobileNav, open && style.active)}>
          <ul className={style.mobileNavList}>
            <li>
              <Link
                href="#"
                className={style.mobileNavLink}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#howItWorks"
                className={style.mobileNavLink}
                onClick={() => setOpen(false)}
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="#rewards"
                className={style.mobileNavLink}
                onClick={() => setOpen(false)}
              >
                Rewards
              </Link>
            </li>
            <li>
              <Button
                size="sm"
                className={style.mobileButton}
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Button>
            </li>
            <li>
              <Button
                size="sm"
                variant="outline"
                className={style.mobileButton}
                onClick={() => setOpen(false)}
              >
                Login
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
