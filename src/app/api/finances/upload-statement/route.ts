
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";
import { reconcileBankStatement } from "@/services/finance/reconciliationService";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No se ha subido ningún archivo", { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const suggestions = await reconcileBankStatement(data as any);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("[UPLOAD_STATEMENT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
