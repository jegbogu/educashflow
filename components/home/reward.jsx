import React from "react";
import Title from "../title";
import Image from "next/image";
import { Button } from "./button";
import { DashboardImg } from "./dashboardImg";
import { useRouter } from "next/router";
export default function Reward() {
  const router = useRouter()
  return (
    <section id="rewards" className="relative w-full">
      {/* background stripes */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-7">
        <div className="col-span-3 bg-accent"></div>
        <div className="col-span-4 bg-secondary p-4"></div>
      </div>

      {/* content sits above */}
      <div className="relative grid md:grid-cols-7 grid-cols-1 bg-acc">
        {/* Left side content */}
        <div className="col-span-3 w-full p-4">
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
                <div  >
                  <span  >
                    <Image src="/quizSection2.png" width={500} height={500} />
                  </span>
                   
                </div>
            
              <button className="w-full bg-[#21294F] py-6 rounded-xl text-white hover:bg-[#21294F]/90">
                 Redeem Now
              </button>
                {/* <button className="w-full bg-[#21294F] py-6 rounded-xl text-white hover:bg-[#21294F]/90" onClick={router.push("/dashboard")}>
                  Redeem Now
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Right side content */}
        <div className="col-span-4 w-full p-6 overflow-hidden">
          <Title className="text-white leading-normal my-4">
            What We Do Differently <br /> From The Others
          </Title>
          <div className="w-full">
            <Image src="/dashboardSection.png" width={900} height={900} className="rounded rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
