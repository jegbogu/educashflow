import React from "react";
import Title from "../title";
import Image from "next/image";
import Quotes from "../Quotes";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import BgSvg from "../layout/bg";

export default function Testimonials() {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 3000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const testimonies = [
  {
    testimony:
      "The quiz system is simple and fun to use. Answering questions and earning points keeps me motivated, and I love being able to track everything in my wallet.",
    name: "Arden Price",
    contact: "arden@lytbot",
    image: "/testimonial-img1.png",
    occupation: "Participant",
  },
  {
    testimony:
      "Registration was quick, the coupon worked instantly, and I was able to start quizzes right away. Earning rewards for knowledge makes the experience exciting and engaging.",
    name: "Emery Blake",
    contact: "emery@lytbot",
    image: "/testimonial-img2.png",
    occupation: "Quiz User",
  },
  {
    testimony:
      "This platform turns learning into real value. The secure system, reward tracking, and smooth quiz experience make it perfect for engaging users and encouraging participation.",
    name: "Maren Caldwell",
    contact: "maren@lytbot",
    image: "/testimonial-img3.png",
    occupation: "Platform Manager",
  },
];


  return (
    <section className="max-w-7xl mx-auto my-16 py-4 space-y-16 px-4">
      
      <div className="">
        <Title className={"leading-normal"}>
          Hear From Our Satisfied
          <br /> Clients
        </Title>
      </div>
      <div className="carousel keen-slider" ref={sliderRef}>
        {testimonies.map((item, i) => (
          <div key={i} className="carousel-item keen-slider__slide">
            <div className="testimonial">
              <Quotes />
              <blockquote>{item.testimony}</blockquote>
              <h4 className="text-lg font-semibold">{item.name}</h4>
              <span>
                <span className="text-primary"> {item.contact}</span> |{" "}
                {item.occupation}
              </span>
            </div>
            <div className="carousel-img">
              <Image
                src={item.image}
                alt="Testimonial Image 1"
                width={300}
                height={200}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
