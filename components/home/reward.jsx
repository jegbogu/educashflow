import React from "react";
import Title from "../title";
import Image from "next/image";
import { Button } from "./button";

export default function Reward() {
  return (
    <section className="relative w-full">
      {/* background stripes */}
      <div className="absolute inset-0 grid grid-cols-7">
        <div className="col-span-3 bg-accent"></div>
        <div className="col-span-4 bg-secondary"></div>
      </div>

      {/* content sits above */}
      <div className="relative grid grid-cols-5 max-w-7xl mx-auto">
        {/* Left side content */}
        <div className="col-span-2 w-full">
          <div className="max-w-md mx-auto px-2 py-4">
            <Title className={"my-4"}>Reward & Wallet</Title>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#21294F] text-white p-4 rounded-lg">
                <span>
                  <Image src={"wallet3.svg"} width={50} height={50}/>
                </span>
                <div>
                  <span>You have</span>
                  <p>1,250 points</p>
                </div>
              </div>
              <div className="bg-white phone text-black p-4 rounded-lg">
                <div>
                  <span className="bg-secondary p-4 rounded-xl">
                    <Image src={"amason.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p>Gift Card</p>
                    <span>(amaon, Google Play)</span>
                  </div>
                </div>
                <div>
                  <span className="bg-[#D966FA] p-4 rounded-xl">
                    <Image src={"discount.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p>Shopping Discount</p>
                  </div>
                </div>
                <div>
                  <span className="bg-[#7866FA] p-4 rounded-xl">
                    <Image src={"premium.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p>Premium access</p>
                  </div>
                </div>
                <Button className={"w-full bg-[#21294F] py-6 rounded-xl"}>
                  Redeem Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="min-h-52 col-span-3 w-full"></div>
      </div>
    </section>
  );
}
