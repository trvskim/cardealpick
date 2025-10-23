"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { track } from '@vercel/analytics';
import { Car, Phone, CheckCircle, Clock, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    carNumber: "",
    carModel: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // 페이지 방문 추적
  useEffect(() => {
    track('page_view', {
      page: 'landing_page',
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ carNumber: "", carModel: "", phoneNumber: "" });
        
        // Vercel Analytics 이벤트 추적
        track('car_inquiry_submitted', {
          car_number: formData.carNumber,
          car_model: formData.carModel,
          timestamp: new Date().toISOString()
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // 폼 필드 입력 추적
    track('form_field_updated', {
      field: e.target.name,
      has_value: e.target.value.length > 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-8 sm:mb-10">
              <Image 
                src="/logo.png" 
                alt="카딜픽 로고" 
                width={384}
                height={200}
                className="mx-auto w-72 sm:w-84 lg:w-96 h-auto drop-shadow-lg"
                priority
              />
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto px-2 break-keep leading-relaxed">
              전문 딜러가 직접 방문하여 최고의 시세로 빠르게<br />중고차·수출·폐차 최적의 판매 방식으로
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 px-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                <span className="text-base sm:text-lg break-keep">당일 현금 지급</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                <span className="text-base sm:text-lg break-keep">안전한 거래</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                <span className="text-base sm:text-lg break-keep">최고가 매입</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                <span className="text-base sm:text-lg break-keep">전국 방문 출장</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 break-keep">
              무료 차량 견적 신청
            </h2>
            <p className="text-base sm:text-lg text-gray-600 break-keep leading-relaxed px-2">
              정보를 입력해주시면 전문 딜러가 빠르게 안내드립니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="carNumber" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 break-keep">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  차량 번호
                </div>
              </label>
              <input
                type="text"
                id="carNumber"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                required
                placeholder="예: 12가 3456"
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base sm:text-lg transition-all break-keep"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div>
              <label htmlFor="carModel" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 break-keep">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  차종 및 모델명
                </div>
              </label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
                placeholder="예: 현대 그랜저 2020년식"
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base sm:text-lg transition-all break-keep"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 break-keep">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  연락처
                </div>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="예: 010-1234-5678"
                className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base sm:text-lg transition-all break-keep"
                style={{ fontSize: '16px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white font-bold py-4 sm:py-5 px-6 rounded-lg text-base sm:text-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg break-keep touch-manipulation"
            >
              {isSubmitting ? "전송 중..." : "무료 견적 신청하기"}
            </button>

            {submitStatus === "success" && (
              <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-3 rounded-lg text-center break-keep">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 inline-block mr-2" />
                <span className="text-sm sm:text-base">신청이 완료되었습니다! 곧 연락드리겠습니다.</span>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg text-center break-keep">
                <span className="text-sm sm:text-base">전송 중 오류가 발생했습니다. 다시 시도해주세요.</span>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-10 sm:mb-12 lg:mb-16 break-keep">
            왜 저희를 선택해야 하나요?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-keep">빠른 처리</h3>
              <p className="text-sm sm:text-base text-gray-600 break-keep leading-relaxed">
                접수 후 30분 이내 연락, 당일 방문 가능하며 즉시 현금 지급해드립니다
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-keep">안전한 거래</h3>
              <p className="text-sm sm:text-base text-gray-600 break-keep leading-relaxed">
                투명한 견적과 정확한 시세로 안전하고 믿을 수 있는 거래를 보장합니다
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 break-keep">최고가 매입</h3>
              <p className="text-sm sm:text-base text-gray-600 break-keep leading-relaxed">
                실시간 시세 분석을 통해 시장 최고가로 차량을 매입해드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg sm:text-xl font-bold text-white mb-2">카딜픽</p>
          <p className="text-sm sm:text-base text-gray-400 break-keep">© 2025 카딜픽. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}




