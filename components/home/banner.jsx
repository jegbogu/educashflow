import React from "react";
import { Button } from "./button";
import Image from "next/image";

export default function Banner() {
  return (
    <section className="max-w-7xl m-auto lg:min-h-[80vh] flex items-center justify-between gap-4 px-4">
      <div className="space-y-8">
        <h1 className="capitalize text-7xl font-bold text-white leading-normal">
          answer
          <br />
          Questions <br />
          earn <span className="text-primary">rewards</span>
        </h1>
        <p className="text-white text-xl">
          Register today, use your coupon, and start
          <br /> winning points you can spend in your wallet
        </p>
        <Button size="lg">Register Now </Button>
        <div className="landing-features pb-4">
          <span>
            <span>
              <Image
                src={"secure.svg"}
                width={50}
                height={50}
                alt="landing icon"
              />
            </span>
            Secure <br /> Registration
          </span>
          <span>
            <span>
              <Image
                src={"coupon.svg"}
                width={50}
                height={50}
                alt="landing icon"
              />
            </span>
            Coupon Activated
            <br /> Quizzes
          </span>
          <span>
            <span>
              <Image
                src={"wallet.svg"}
                width={50}
                height={50}
                alt="landing icon"
              />
            </span>
            Instant Wallet Point
          </span>
        </div>
      </div>
      <div className="img">
        <Image
          src="home-img.svg"
          width={400}
          height={400}
          alt="home image"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
