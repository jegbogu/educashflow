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

  return (
    <header>
      {/* Desktop Navbar */}
      <nav className={style.navbar}>
        <ul>
          <li>
            <Link href="#">Home</Link>
          </li>
          <li>
            <Link href="#">How it Works</Link>
          </li>
          <li>
            <Link href="#">Rewards</Link>
          </li>
          <li>
            <Button>Sign Up</Button>
          </li>
          <li>
            <Button>Login</Button>
          </li>
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <div className={cn(style.mobileContainer, scrolled && style.scrolled)}>
        <section>
          <div className={style.mobile}>
            <h4>Logo</h4>
            <span
              className={style.burger}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>

          <nav className={cn(open && style.active)}>
            <ul>
              <li>
                <Link href="#">Home</Link>
              </li>
              <li>
                <Link href="#">How it Works</Link>
              </li>
              <li>
                <Link href="#">Rewards</Link>
              </li>
              <li>
                <Button>Sign Up</Button>
              </li>
              <li>
                <Button>Login</Button>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </header>
  );
}
