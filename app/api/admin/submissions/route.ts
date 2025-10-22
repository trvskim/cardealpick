import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "submissions.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ submissions: [] });
    }

    // Read submissions
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const submissions = JSON.parse(fileContent);

    // Sort by timestamp (newest first)
    submissions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Failed to read submissions:", error);
    return NextResponse.json(
      { error: "Failed to read submissions" },
      { status: 500 }
    );
  }
}




