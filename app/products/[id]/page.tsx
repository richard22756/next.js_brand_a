import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ProductTabs from "@/app/components/ProductTabs";
import BuyButton from "@/app/components/BuyButton";

type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
};

export const revalidate = 60;

async function getProduct(id: string) {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const data = await fs.promises.readFile(filePath, "utf-8");
  const products = JSON.parse(data);
  return products.find((p: Product) => p.id === parseInt(id));
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        {/* Bagian atas: gambar dan info produk */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-64 object-cover rounded-xl shadow"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4 text-lg">
              Rp {product.price.toLocaleString()}
            </p>
            <p className="text-gray-500 mb-4">
              Stok:{" "}
              <span
                className={`font-semibold ${
                  product.stock && product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.stock && product.stock > 0
                  ? `${product.stock} tersedia`
                  : "Habis"}
              </span>
            </p>

            {/* Tombol beli dari komponen client */}
            <BuyButton productId={id} />
          </div>
        </div>

        {/* Tab Produk */}
        <div className="mt-8">
          <ProductTabs
            description={
              product.description || "Belum ada deskripsi untuk produk ini."
            }
            reviews={["Bagus banget!", "Kualitas oke", "Pengiriman cepat"]}
            specifications="Warna: Merah, Material: Katun Premium"
          />
        </div>
      </div>
    </main>
  );
}
