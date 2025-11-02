import fs from "fs";
import path from "path";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const data = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        🛍️ Brand A Store
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-3">
                Rp {product.price.toLocaleString()}
              </p>
              <Link
                href={`/products/${product.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
