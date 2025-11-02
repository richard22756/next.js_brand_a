"use client"; 
// artinya: komponen ini dirender di sisi client (browser), bukan server

import { useState } from "react";

interface ProductTabsProps {
  description?: string;
  reviews?: string[];
  specifications?: string;
}

export default function ProductTabs({
  description,
  reviews = [],
  specifications,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "specs">("description");

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("description")}
          className={`px-4 py-2 rounded-md ${activeTab === "description" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Deskripsi
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 rounded-md ${activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Ulasan
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`px-4 py-2 rounded-md ${activeTab === "specs" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Spesifikasi
        </button>
      </div>

      {/* Konten tab */}
      <div className="bg-gray-50 p-4 rounded-md">
        {activeTab === "description" && <p>{description || "Belum ada deskripsi."}</p>}
        {activeTab === "reviews" && (
          <ul className="list-disc list-inside space-y-2">
            {reviews.length > 0
              ? reviews.map((r, i) => <li key={i}>{r}</li>)
              : <p>Belum ada ulasan.</p>}
          </ul>
        )}
        {activeTab === "specs" && <p>{specifications || "Spesifikasi belum tersedia."}</p>}
      </div>
    </div>
  );
}
