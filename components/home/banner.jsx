import React, { useState } from "react";
import { Button } from "./button";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import style from "@/styles/Home.module.css";
import UsersQuiz from "../UserQuiz/quiz";

export default function Banner(props) {
  const [modal, setModal] = useState(false);
  const springs = useSpring({
    from: { x: -700 },
    to: { x: 0 },
  });

  const features = useSpring({
    from: { x: -700 },
    to: { x: 0 },
    delay: 500,
  });

  const img = useSpring({
    from: { x: 400 },
    to: { x: 0 },
  });
  return (
    <section className={style.banner}>
      <animated.div className="space-y-8 w-full my-8" style={{ ...springs }}>
        <h1 className={style.bTitle}>
          answer
          <br />
          Questions <br />
          earn <span className="text-primary">rewards</span>
        </h1>
        <p className="text-white md:text-xl text-lg">
          Register today, use your coupon, and start
          <br /> winning points you can spend in your wallet
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg">Register Now </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setModal(true);
            }}
          >
            Start Quiz
          </Button>
          {modal && (
            <UsersQuiz
              allQuestions={props.allQuestions}
              onClose={() => {
                setModal(false);
              }}
            />
          )}
        </div>

        <animated.div className="landing-features " style={{ ...features }}>
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
        </animated.div>
      </animated.div>
      <animated.div className="img my-12 lg:my-0" style={{ ...img }}>
        <Image
          src="home-img.svg"
          width={400}
          height={400}
          alt="home image"
          className="w-full h-full object-cover"
        />
      </animated.div>
      <animated.div className="sm landing-features" style={{ ...features }}>
        <span>
          <span>
            <Image
              src={"secure.svg"}
              width={50}
              height={50}
              alt="landing icon"
            />
          </span>
          Secure Registration
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
          Coupon Activated Quizzes
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
      </animated.div>
    </section>
  );
}
