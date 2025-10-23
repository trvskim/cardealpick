import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

export const metadata: Metadata = {
  title: "카딜픽 - 빠르고 정확한 중고차 매입 서비스",
  description: "카딜픽 - 고가의 중고차 매입, 신속한 현금 지급, 전문 딜러가 직접 방문합니다.",
  keywords: "카딜픽, 중고차 매입, 자동차 매입, 차량 매입, 내차팔기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}




