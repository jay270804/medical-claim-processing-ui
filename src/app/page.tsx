"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="w-full flex justify-end items-center px-6 py-4 bg-slate-950/80 backdrop-blur z-20 sticky top-0">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-[#2f7ff2] text-white hover:bg-[#2563eb] font-semibold shadow"
            onClick={() => router.push("/register")}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Register
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#2f7ff2] text-[#2f7ff2] hover:bg-[#2f7ff2]/10 font-semibold shadow"
            onClick={() => router.push("/login")}
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center flex-1 px-4 py-16 md:py-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-center mb-4 text-[#2f7ff2] drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Medical Claims Processing System
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-slate-300 text-center max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Streamline your healthcare claims with AI-powered automation. Secure, fast, and easy to use for providers and patients alike.
        </motion.p>
      </motion.section>

      {/* Video Section */}
      <motion.section
        className="w-full flex justify-center items-center bg-transparent py-8 flex-shrink-0"
        style={{ minHeight: "40vh" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-slate-800">
          <motion.video
            className="w-full h-full object-fill"
            src="/Medical Claim Processing UI Demo.compressed.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/video-poster.png"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          />
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="flex flex-col items-center justify-center py-12 px-4 bg-slate-950 mb-5">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#2f7ff2]">Why Choose Us?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {[{
            icon: "⚡",
            title: "Fast Processing",
            desc: "AI-driven claim extraction and validation for rapid turnaround."
          }, {
            icon: "🔒",
            title: "Secure & Private",
            desc: "Encrypted document storage and processing."
          }, {
            icon: "🩺",
            title: "For Providers & Patients",
            desc: "Intuitive dashboards and tools for all users, anytime, anywhere."
          }].map((feature, i) => (
            <motion.li
              key={feature.title}
              className="bg-slate-900 rounded-lg p-6 shadow border border-slate-800 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(47,127,242,0.15)" }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <span className="text-3xl mb-2">{feature.icon}</span>
              <span className="font-semibold text-lg mb-1">{feature.title}</span>
              <span className="text-slate-400 text-sm text-center">{feature.desc}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <motion.footer
        className="w-full bg-slate-900 border-t border-slate-800 py-4 flex flex-col items-center text-center mt-auto gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
        <span className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Medical Claims Processing UI. All rights reserved.</span>
        <span className="text-slate-600 text-xs mt-1">Built with <span className="text-[#2f7ff2] font-semibold">Next.js</span> &amp; <span className="text-[#2f7ff2] font-semibold">shadcn/ui</span></span>
      </motion.footer>
    </div>
  );
}
