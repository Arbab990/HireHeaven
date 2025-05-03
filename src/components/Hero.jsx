"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const Hero = () => {
  return (
    <section className="body-font bg-secondary">
      <div className="container mx-auto flex px-5 py-20 md:flex-row flex-col items-center">
        {/* Hero Image */}
        <motion.div
          className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            className="object-cover object-center rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            src="/hero.jpeg"
            alt="Job search platform"
          />
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.h1
            className="sm:text-5xl text-4xl mb-6 font-extrabold leading-tight text-gray-900"
            variants={fadeInUp}
            custom={1}
          >
            Welcome to <span className="text-blue-500">JobNest</span>
            <br className="hidden lg:inline-block" />
            Your gateway to career success
          </motion.h1>
          <motion.p
            className="mb-8 text-lg text-gray-700 md:w-[80%]"
            variants={fadeInUp}
            custom={2}
          >
            Discover opportunities that match your skills and passions. At JobNest, we connect ambitious talent with top companies, simplify your job search, and empower your career journey.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex  flex-wrap justify-center gap-4"
            variants={fadeInUp}
            custom={3}
          >
            <Link href={"/resumebuilder"}>
              <Button  className="px-6 py-3 text-base">
                Resume Builder
              </Button>
            </Link>
            <Link href={"/jobs"}>
              <Button className="px-6 py-3 text-base">Browse Jobs</Button>
            </Link>
            <Link href={"/about"}>
              <Button variant="outline" className="px-6 py-3 text-base">
                About Us
              </Button>
            </Link>
            <Link href={"/resumeanalyzer"}>
              <Button variant="outline" className="px-6 py-3 text-base">
                Resume Analyzer
              </Button>
            </Link>
            <Link href={"/learn"}>
              <Button variant="outline" className="px-6 py-3 text-base">
                Learn
              </Button>
            </Link>
            <Link href={"/techtalks"}>
              <Button variant="outline" className="px-6 py-3 text-base">
                TechTalks
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

