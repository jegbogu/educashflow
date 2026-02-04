import React, { useState } from "react";
import Title from "../title";
import Plus from "../icons/plus";

export default function Faqs() {
  const [active, setActive] = useState({ id: null, open: false });
  const faqs = [
  {
    id: 1,
    question: "How do I start?",
    answer:
      "Simply register on the platform, and start taking quizzes. You’ll earn points for every correct answer.",
  },
  {
    id: 2,
    question: "Do I need an account to play?",
    answer:
      "Yes. You need an account so your points, rewards, and wallet balance can be securely tracked.",
  },
  {
    id: 3,
    question: "Can I play on my phone?",
    answer:
      "Yes. The platform is fully responsive and works smoothly on mobile phones, tablets, and desktops.",
  },
  {
    id: 4,
    question: "Is there a time limit for answering each question?",
    answer:
      "Yes all quizzes are timed to keep things competitive.",
  },
  {
    id: 5,
    question: "Is this legit?",
    answer:
      "Absolutely. All quizzes, points, and rewards are managed through a secure system to ensure fairness and transparency.",
  },
  {
    id: 6,
    question: "Is it free?",
    answer:
      "Yes. Registration is free, and coupons give you the chance to earn more point and win faster.",
  },
];

  return (
    <section className="max-w-7xl mx-auto my-16 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between p-4">
        <div>
          <Title className="leading-normal">
            Frequently Asked
            <br />
            Questions
          </Title>
          <p className="normal-case text-lg font-light text-neutral-800">
            Got any Question? We have got answer
          </p>
        </div>
        <div className="md:max-w-screen-sm w-full ">
          <div className="faqs space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="faq w-full p-4 bg-accent text-text rounded-md"
              >
                <span
                  className="flex justify-between gap-4 items-center cursor-pointer"
                  onClick={() => {
                    setActive({
                      id: faq.id,
                      open: faq.id !== active.id || !active.open,
                    });
                  }}
                >
                  <p className="font-semibold">{faq.question}</p>
                  <Plus
                    className="size-5 cursor-pointer"
                    onClick={() => {
                      setActive({
                        id: faq.id,
                        open: faq.id !== active.id || !active.open,
                      });
                    }}
                  />
                </span>

                <div
                  className={`grid transition-all duration-500 ease-in-out overflow-hidden
          ${
            active.id === faq.id && active.open
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0"
          }`}
                >
                  <div className="overflow-hidden">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
