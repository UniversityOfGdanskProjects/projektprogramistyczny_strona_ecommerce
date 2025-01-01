"use client";
import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  return <Layout>edytuj produkt tutaj</Layout>;
}
