"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Nav from "./Components/Nav";

export default function Home() {
  const [snipkitLogo, setSnipkitLogo] = useState("/snipkit-logo-light.png");
  const [clerkLogo, setClerkLogo] = useState("/clerk-logo-light.png");
  const [permitLogo, setPermitLogo] = useState("/permit-logo.png");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setSnipkitLogo("/snipkit-logo-dark.png");
      setClerkLogo("/clerk-logo-dark.png");
      // Permit logo works for light and dark mode
    }
  }, []);

  return (
    <main>
      <Nav activeMenu="home" />
      <p>This is a demo of how to use:</p>
      <div className="intro">
        <div className="feature">
          <div className="imageContainer">
            <Image src={snipkitLogo} alt="Snipkit" layout="fill" sizes="100px" />
          </div>
          <p>
            Snipkit to protect your web application against attacks. We&apos;ll
            identity visitors
          </p>
        </div>
        <div className="feature">
          <div className="imageContainer">
            <Image src={clerkLogo} alt="Clerk" layout="fill" sizes="100px" />
          </div>
          <p>
            ... based on authentication via an integration with Clerk, and then
          </p>
        </div>
        <div className="feature">
          <div className="imageContainer">
            <Image src={permitLogo} alt="Permit" layout="fill" sizes="100px" />
          </div>
          <p>
            ... look up their role in Permit to determine further limitations.
          </p>
        </div>
      </div>
      <p>
        Check out the{" "}
        <a href="https://blog.snipkit.khulnasoft.com/permissions-based-security-in-nextjs-with-snipkit-and-permitio/">
          Permissions-Based Security in Next.js Apps: A Practical Guide with
          Snipkit and Permit.io
        </a>{" "}
        article on our blog for the writeup.
      </p>
    </main>
  );
}
