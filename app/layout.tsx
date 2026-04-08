import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "공간플랫폼개발그룹 대시보드",
  description: "Poi · Display · Dynamic 팀 작업현황 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
