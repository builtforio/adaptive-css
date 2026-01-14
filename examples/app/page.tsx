"use client";

import dynamic from "next/dynamic";

// Dynamically import the main content with SSR disabled
// This prevents the adaptive-css library from being evaluated during SSR
const HomeContent = dynamic(() => import("@/components/HomeContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <HomeContent />;
}
