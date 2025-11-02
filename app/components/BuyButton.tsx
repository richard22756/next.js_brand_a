"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyButton({ productId }: { productId: string | number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Gagal membuat pesanan");
        return;
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `/products/${productId}` }),
      });


      alert("Pesanan berhasil dibuat!");
      router.push("/products");

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } text-white font-medium px-5 py-2 rounded-lg transition`}
    >
      {loading ? "Memproses..." : "🛒 Beli Sekarang"}
    </button>
  );
}
