import React from "react";
import { Button } from "./button";

export default function Banner() {
  return (
    <section className="max-w-7xl m-auto lg:h-[80vh] flex items-center">
      <div className="space-y-8">
        <h1 className="capitalize text-7xl font-bold text-white leading-normal">
          answer
          <br />
          Questions <br />
          earn <span className="text-primary">rewards</span>
        </h1>
        <p className="text-white text-2xl">
          Register today, use your coupon, and start
          <br /> winning points you can spend in your wallet
        </p>
        <Button size='lg'>Register Now </Button>
        <div className="flex gap-8 items-center text-white text-lg">
          <span>
            <span></span>
            Secure <br /> Registration
          </span>
          <span>
            <span></span>
            Coupon Activated
            <br /> Quizzes
          </span>
          <span>
            <span></span>
            Instant Wallet Point
          </span>
        </div>
      </div>
    </section>
  );
}
