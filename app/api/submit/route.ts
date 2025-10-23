import { NextRequest, NextResponse } from "next/server";

interface SubmissionData {
  carNumber: string;
  carModel: string;
  phoneNumber: string;
}

// Send message to Telegram
async function sendToTelegram(data: SubmissionData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("Telegram Debug:", { botToken: botToken ? "SET" : "NOT SET", chatId });

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured", { botToken: !!botToken, chatId: !!chatId });
    return;
  }

  const message = `
🚗 새로운 차량 매입 문의

📋 차량 번호: ${data.carNumber}
🚘 차종/모델: ${data.carModel}
📞 연락처: ${data.phoneNumber}

⏰ 접수 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
  `;

  console.log("Sending message to Telegram:", {
    chatId,
    messageLength: message.trim().length,
    messagePreview: message.trim().substring(0, 100) + "..."
  });

  try {
    console.log("Starting Telegram API call...");
    
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message.trim(),
          parse_mode: "HTML",
        }),
      }
    );

    console.log("Telegram API response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
      console.error("Response status:", response.status);
      console.error("Response headers:", Object.fromEntries(response.headers.entries()));
      throw new Error(`Telegram API error: ${response.status}`);
    } else {
      const responseData = await response.json();
      console.log("Telegram message sent successfully");
      console.log("Telegram API response:", responseData);
      return true;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Telegram API request timeout");
    } else {
      console.error("Failed to send Telegram message:", error);
    }
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: SubmissionData = await request.json();

    // Validate data
    if (!data.carNumber || !data.carModel || !data.phoneNumber) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요" },
        { status: 400 }
      );
    }

    // Send to Telegram (blocking to ensure it completes)
    let telegramSuccess = false;
    try {
      const result = await sendToTelegram(data);
      telegramSuccess = result === true;
    } catch (error) {
      console.error("Telegram sending failed:", error);
    }

    console.log("Submission completed:", {
      telegram_sent: telegramSuccess,
      car_number: data.carNumber,
      car_model: data.carModel,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "신청이 완료되었습니다",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}




