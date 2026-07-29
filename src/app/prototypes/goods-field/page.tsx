import type { Metadata } from "next";
import { GoodsFieldExperience } from "./goods-field-experience";

export const metadata: Metadata = {
  title: "Every object keeps a relationship alive | A Curious Tractor",
  description: "An interactive field story about Goods on Country, material, support and ownership.",
  robots: { index: false, follow: false },
};

export default function GoodsFieldPage() {
  return <GoodsFieldExperience />;
}
