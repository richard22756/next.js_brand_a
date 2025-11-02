import fs from "fs";
import path from "path";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");
const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

// Simulasi delay untuk meniru kondisi race (2 request bersamaan)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ----- Types ----- */
type Product = {
  id: number;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  stock?: number;
};

type Order = {
  id: number;
  productId: number;
  quantity: number;
  time: string;
};

type CheckoutBody = {
  productId: string | number;
  quantity: number;
};

/* ----- Type guards ----- */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCheckoutBody(value: unknown): value is CheckoutBody {
  if (!isObject(value)) return false;
  const pid = (value as Record<string, unknown>).productId;
  const qty = (value as Record<string, unknown>).quantity;
  // productId must be string or number, quantity must be a finite number > 0
  const validPid = typeof pid === "string" || typeof pid === "number";
  const validQty = typeof qty === "number" && Number.isFinite(qty) && qty > 0;
  return validPid && validQty;
}

/* ----- Handler ----- */
export async function POST(req: Request) {
  try {
    const raw = await req.json();
    if (!isCheckoutBody(raw)) {
      return Response.json({ success: false, message: "Bad request: invalid body." }, { status: 400 });
    }
    const { productId: rawPid, quantity } = raw;
    const productId = typeof rawPid === "string" ? parseInt(rawPid, 10) : rawPid;

    // Read products
    const productData = await fs.promises.readFile(PRODUCTS_PATH, "utf-8");
    const products = JSON.parse(productData) as Product[];

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return Response.json({ success: false, message: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Simulasi stok default (jika tidak ada field stock)
    if (typeof product.stock !== "number") product.stock = 3;

    // Delay agar race condition bisa terjadi kalau dua request cepat
    await delay(1000);

    if (product.stock <= 0) {
      return Response.json({ success: false, message: "Stok habis!" }, { status: 400 });
    }

    if (product.stock < quantity) {
      return Response.json({ success: false, message: "Stok tidak mencukupi." }, { status: 400 });
    }

    // Kurangi stok
    product.stock = product.stock - quantity;

    // Simpan perubahan produk (overwrite products.json)
    await fs.promises.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");

    // Tambahkan order baru ke orders.json
    const ordersData = await fs.promises.readFile(ORDERS_PATH, "utf-8");
    const orders = (JSON.parse(ordersData) as Order[]) ?? [];

    const newOrder: Order = {
      id: orders.length + 1,
      productId,
      quantity,
      time: new Date().toISOString(),
    };

    orders.push(newOrder);
    await fs.promises.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf-8");

    return Response.json({ success: true, message: "Pesanan berhasil!", order: newOrder });

    
  } catch (error: unknown) {
    // safe error logging: don't assume error is Error
    console.error("Checkout error:", error);
    return Response.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
