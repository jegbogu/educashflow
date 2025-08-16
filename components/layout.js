import React from "react";
import Footer from "./layout/footer";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({ children }) {
  return (
    <body className={poppins.className}>
      <main>{children}</main>
      <Footer />
    </body>
  );
}
