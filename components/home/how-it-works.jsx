import React from "react";
import Title from "../title";
import Image from "next/image";
import Rightarrow from "../icons/arrow";

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto my-12 p-4">
      <div className="space-y-16">
        <Title className="text-center">How it works</Title>

        <div className="howItWorks">
          <div className="card">
            <div className="works-icon">
              <Image src={"user.svg"} width={50} height={50} alt="works-img" />
            </div>
            <p className="card-title">
              Register & <br />
              Activate Coupon{" "}
            </p>
            <p>Sign up and enter your coupon to unlock the game</p>
          </div>
          <span>
            <Rightarrow fill="#0f1632" className="w-10" />
          </span>
          <div className="card">
            <div className="works-icon">
              <Image
                src={"support.svg"}
                width={50}
                height={50}
                alt="works-img"
              />
            </div>
            <p className="card-title">
              Answer Fun
              <br /> Questions
            </p>
            <p>Test your knowledge with our quizzes</p>
          </div>
          <span>
            <Rightarrow fill="#0f1632" className="w-10" />
          </span>

          <div className="card">
            <div className="works-icon">
              <Image
                src={"wallet2.svg"}
                width={50}
                height={50}
                alt="works-img"
              />
            </div>
            <p className="card-title">
              Earn Points <br />& Reward
            </p>
            <p>
              Points go straight into <br />
              your wallet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
