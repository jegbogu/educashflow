import React from 'react'
import Title from '../title';
import Image from 'next/image';
import Quotes from '../Quotes';

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto my-16 py-4 space-y-16">
      <div className="">
        <Title className={"leading-normal"}>
          Hear From Our Satisfied
          <br /> Clients
        </Title>
      </div>
      <div className="carousel">
        <div className="carousel-item">
          <div className="testimonial">
            <Quotes />
            <blockquote>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </blockquote>
            <h4 className='text-lg font-semibold'>Arden Price</h4>
            <span><span className='text-primary'>arden@lytbot </span>| Tutor</span>
          </div>
          <div className="carousel-img">
            <Image
              src={"/testimonial-img1.png"}
              alt="Testimonial Image 1"
              width={300}
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
