import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="">
      <section className="max-w-7xl mx-auto p-4 py-8">
        <div className="flex flex-col md:flex-row">
          <div className="hidden sm: block max-w-72 w-full min-h-32">
            <Link href={'/'} ><img src="logo.jpg" className="border rounded-md" width={180}/></Link>
          </div>
          <div className="links-groups">
            <div className="capitalize">
              <h5 className="text-orange-400">Quick Links</h5>
              <ul>
                <li>
                  <Link href={"/#"}>Home</Link>
                </li>
                <li>
                  <Link href={"#howItWorks"}>How It Works</Link>
                </li>
                <li>
                  <Link href={"#rewards"}>Rewards</Link>
                </li>
                <li>
                  <Link href={"/login"}>Login</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-orange-400">Contact Info</h5>
              <ul>
                <li>
                  Email:{" "}
                  <Link href={"mailto:Eduquizzgloballimited@gmail.com"}>
                    Eduquizzgloballimited@gmail.com

                  </Link>
                </li>
                <li>
                  Phone:{" "}
                  <Link href={"tel:+2348039420442"}>+234-803-942-0442</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-orange-400">Socials</h5>
              <span className="flex gap-4">
                <Link href={"https://www.facebook.com/profile.php?id=61570815691404"} target="self">
                  <Image
                    src="facebook.svg"
                    alt="Facebook"
                    width={24}
                    height={24}
                  />
                </Link>
                {/* <Link href={"#"}>
                  <Image src="x.svg" alt="Facebook" width={24} height={24} />
                </Link> */}
                <Link href={"https://www.instagram.com/limitededuquizzglobal/"}>
                  <Image src="ig.svg" alt="Facebook" width={24} height={24} />
                </Link>
                <Link href={"https://wa.me/2348163394086"}>
                  <Image
                    src="/whatsapp.png"
                    alt="Facebook"
                    width={24}
                    height={34}
                  />
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-16 flex-col sm:flex-row">
          <div className="flex flex-col sm:flex-row gap-4 font-light">
            <p className="italic">
              &copy; {new Date().getFullYear()} Eduquizz Global Limited. All rights
              reserved.
            </p>
            <Link href={"/tosap"}>Terms of Service</Link>
            <Link href={"/tosap"}>Privacy Policy</Link>
            <Link href={"/DISCLAIMER"}>Disclaimer</Link>
          </div>
          <Link href="https://www.mediaplur.com/" target="_blank" className="mt-[30px] sm:mt-0">
            <div class=" flex items-center space-x-2">
              <p>Designed by Mediaplur</p>
              <span>
                <img src="logo.webp" alt="Logo" class="w-19 h-8" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </footer>
  );
}
