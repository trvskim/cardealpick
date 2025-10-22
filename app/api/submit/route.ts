import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface SubmissionData {
  carNumber: string;
  carModel: string;
  phoneNumber: string;
}

// Save submission to local JSON file
async function saveSubmission(data: SubmissionData) {
  const dataDir = path.join(process.cwd(), "data");
  const filePath = path.join(dataDir, "submissions.json");

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Read existing submissions
  let submissions: any[] = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    submissions = JSON.parse(fileContent);
  }

  // Add new submission
  const newSubmission = {
    ...data,
    timestamp: new Date().toISOString(),
    id: Date.now().toString(),
  };
  submissions.push(newSubmission);

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
  
  return newSubmission;
}

// Send message to Telegram
async function sendToTelegram(data: SubmissionData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram credentials not configured");
    return;
  }

  const message = `
🚗 새로운 차량 매입 문의

📋 차량 번호: ${data.carNumber}
🚘 차종/모델: ${data.carModel}
📞 연락처: ${data.phoneNumber}

⏰ 접수 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
  `;

  try {
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

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
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

    // Save submission to local storage
    const savedSubmission = await saveSubmission(data);

    // Send to Telegram (non-blocking)
    sendToTelegram(data).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "신청이 완료되었습니다",
      data: savedSubmission,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}




