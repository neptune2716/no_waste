"use client";

import React from "react";
import Link from "next/link";
import "tailwindcss/tailwind.css";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to New Waste</h1>
      <Link href="/map" className="text-blue-500">
        Go to Map
      </Link>
    </div>
  );
};

export default HomePage;
