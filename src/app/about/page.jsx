"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

// Animation presets
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const About = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      {/* Hero / Mission */}
      <section className="max-w-3xl mx-auto text-center">
        <motion.img
          src="/about.jpg"
          alt="About"
          className="w-[500px] m-auto mb-6 rounded-lg shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Our Mission At Job <span className="text-blue-400">Nest</span>
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          At JobNest, we’re reimagining the future of job discovery. Our mission is to seamlessly connect ambitious talent with visionary companies, building a thriving ecosystem of opportunity, innovation, and growth. Whether you're starting your career or scaling your team, JobNest is where potential meets purpose.
        </motion.p>
      </section>

      {/* Core Values */}
      <motion.section
        className="max-w-3xl mx-auto text-center my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-2xl font-semibold mb-4" variants={fadeInUp}>
          Our Values
        </motion.h3>
        <motion.ul className="text-lg space-y-2" variants={fadeInUp} custom={1}>
          <li>🚀 Innovation: Embracing change to drive progress.</li>
          <li>💼 Empowerment: Helping individuals own their careers.</li>
          <li>🤝 Integrity: Transparent, honest, and user-focused.</li>
        </motion.ul>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="max-w-3xl mx-auto text-center my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-2xl font-semibold mb-4" variants={fadeInUp}>
          How JobNest Works
        </motion.h3>
        <motion.ul
          className="text-lg space-y-4 text-center"
          variants={fadeInUp}
          custom={1}
        >
          <li>Create a profile as a student or recruiter.</li>
          <li>Students explore jobs, recruiters post opportunities.</li>
          <li>Match, apply, connect, and grow!</li>
        </motion.ul>
      </motion.section>

      {/* Platform Stats */}
      <motion.section
        className="max-w-3xl mx-auto text-center my-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h3 className="text-2xl font-semibold mb-4" variants={fadeInUp}>
          Trusted by Thousands
        </motion.h3>
        <motion.div
          className="flex flex-col md:flex-row justify-around gap-6 text-lg"
          variants={fadeInUp}
          custom={1}
        >
          <div>
            <span className="text-2xl font-bold">5K+</span>
            <br /> Active Users
          </div>
          <div>
            <span className="text-2xl font-bold">1.2K</span>
            <br /> Jobs Listed
          </div>
          <div>
            <span className="text-2xl font-bold">850+</span>
            <br /> Verified Companies
          </div>
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="max-w-3xl mx-auto text-center py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={fadeInUp}>
          Ready to find your dream job?
        </motion.h2>
        <motion.p className="text-lg md:text-xl mb-8" variants={fadeInUp} custom={1}>
          Join thousands of successful job seekers on <span className="text-blue-400">JobNest</span>
        </motion.p>
        <motion.div variants={fadeInUp} custom={2}>
          <Link href="/jobs">
            <Button>Get Started</Button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default About;

