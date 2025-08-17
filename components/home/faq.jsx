import React, { useState } from "react";
import Title from "../title";
import Plus from "../plus";

export default function Faqs() {
  const [active, setActive] = useState({ id: null, open: false });
  const faqs = [
    {
      id: 1,
      question: "How do i start?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
    {
      id: 2,
      question: "Do i need an account to play?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
    {
      id: 3,
      question: "Can i play on my Phone?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
    {
      id: 4,
      question: "Is there a time limit for answering  each question?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
    {
      id: 5,
      question: "Is this legit?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
    {
      id: 6,
      question: "Is it free?",
      answer:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, neque voluptate quam beatae sunt obcaecati!",
    },
  ];
  return (
    <section className="max-w-7xl mx-auto my-16 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between p-4">
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
