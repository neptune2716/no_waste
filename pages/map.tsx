import React from "react";
import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

const TestMap = dynamic(() => import("../components/testmap"), { ssr: false });

const MapPage = () => {
  return (
    <div className="h-screen">
      <h1 className="text-4xl font-bold">Welcome to New Waste</h1>
      <div style={{ width: "100%", height: "80vh" }}>
        <TestMap />
      </div>
    </div>
  );
};

export default MapPage;
