import React from "react";
import Link from "next/link";
import { Button } from "../home/button";

export default function Navbar() {
  return (
    <header>
      {/* <div className="logo">Logo</div> */}
      <nav className="navbar max-w-7xl mx-auto">
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
      </nav>
    </header>
  );
}
