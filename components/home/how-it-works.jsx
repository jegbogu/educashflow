import React, { useEffect } from "react";
import Title from "../title";
import Image from "next/image";
import Rightarrow from "../icons/arrow";
import { useTrail, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const steps = [
  {
    icon: "user.svg",
    title: (
      <>
        Register & <br /> Activate Coupon
      </>
    ),
    desc: "Sign up and enter your coupon to unlock the game",
  },
  {
    icon: "support.svg",
    title: (
      <>
        Answer Fun <br /> Questions
      </>
    ),
    desc: "Test your knowledge with our quizzes",
  },
  {
    icon: "wallet2.svg",
    title: (
      <>
        Earn Points <br /> & Reward
      </>
    ),
    desc: (
      <>
        Points go straight into <br /> your wallet
      </>
    ),
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Start hidden
  const [trail, api] = useTrail(steps.length, () => ({
    opacity: 0,
    transform: "translateY(50px)",
  }));

  // Trigger animation only once when visible
  useEffect(() => {
    if (inView) {
      api.start({
        opacity: 1,
        transform: "translateY(0px)",
        delay: 200, // delay before first card
        config: { tension: 170, friction: 20 },
      });
    }
  }, [inView, api]);

  return (
    <section id="howItWorks" ref={ref} className="max-w-7xl mx-auto my-12 p-4">
      <div className="space-y-16">
        <Title className="text-center">How it works</Title>

        <div className="howItWorks flex items-center gap-6 overflow-hidden">
          {trail.map((style, i) => (
            <React.Fragment key={i}>
              <animated.div className="card" style={style}>
                <div className="works-icon">
                  <Image
                    src={steps[i].icon}
                    width={50}
                    height={50}
                    alt="works-img"
                  />
                </div>
                <p className="card-title">{steps[i].title}</p>
                <p>{steps[i].desc}</p>
              </animated.div>

              {i < steps.length - 1 && (
                <span>
                  <Rightarrow fill="#0f1632" className="w-10" />
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
