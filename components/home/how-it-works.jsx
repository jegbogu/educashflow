import React from "react";
import Title from "../title";

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto my-12 py-4">
      <div className="space-y-8">
        <Title className="text-center">How it works</Title>

        <div className="howItWorks">
          <div>
            <div></div>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus, voluptatem.
            </p>
          </div>
          <div>
            <div></div>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus, voluptatem.
            </p>
          </div>
          <div>
            <div></div>
            <p className="card-title">Lorem ipsum dolor sit amet.</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Doloribus, voluptatem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
