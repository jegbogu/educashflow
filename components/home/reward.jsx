import React from "react";
import Title from "../title";
import Image from "next/image";
import { Button } from "./button";
import { DashboardImg } from "./dashboardImg";

export default function Reward() {
  return (
    <section className="relative w-full">
      {/* background stripes */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-7">
        <div className="col-span-3 bg-accent"></div>
        <div className="col-span-4 bg-secondary"></div>
      </div>

      {/* content sits above */}
      <div className="relative grid md:grid-cols-7 grid-cols-1">
        {/* Left side content */}
        <div className="col-span-3 w-full">
          <div className="max-w-md mx-auto px-2 py-4">
            <Title className={"my-4"}>Reward & Wallet</Title>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#21294F] text-white p-4 rounded-lg">
                <span>
                  <Image src={"wallet3.svg"} width={50} height={50} />
                </span>
                <div>
                  <span>You have</span>
                  <p>1,250 points</p>
                </div>
              </div>
              <div className="bg-white phone text-black p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-secondary p-3 rounded-xl">
                    <Image src={"amason.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p className="font-medium">Gift Card</p>
                    <span className="text-sm text-gray-600">
                      (Amazon, Google Play)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#D966FA] p-3 rounded-xl">
                    <Image src={"discount.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p className="font-medium">Shopping Discount</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#7866FA] p-3 rounded-xl">
                    <Image src={"premium.svg"} width={30} height={30} />
                  </span>
                  <div>
                    <p className="font-medium">Premium Access</p>
                  </div>
                </div>
                <Button className="w-full bg-[#21294F] py-6 rounded-xl text-white hover:bg-[#21294F]/90">
                  Redeem Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="col-span-4 w-full p-6 overflow-hidden">
          <Title className="text-white leading-normal mb-4">
            What We Do Differently <br /> From The Others
          </Title>
          <div className="w-full">
            <DashboardImg />
          </div>
        </div>
      </div>
    </section>
  );
}
