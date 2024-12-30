import Layout from "@/components/layout";
import Link from "next/link";

export default function Products() {
  return (
    <Layout>
      <Link
        className="bg-green-900 rounded-md text-white py-1 px-2"
        href={"/produkty/nowe"}
      >
        Dodaj nowy produkt
      </Link>
    </Layout>
  );
}
