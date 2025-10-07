
import { GoogleGenAI, Type } from "@google/genai";
import { PoItem } from '../types';


// Lazily initialize to avoid crashing on module load if API_KEY is missing.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (ai) return ai;

    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set. Please configure your API Key for Gemini.");
    }
    
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
}

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      po: {
        type: Type.STRING,
        description: 'Số đơn hàng (PO Number)'
      },
      sku: {
        type: Type.STRING,
        description: 'Mã sản phẩm (SKU)'
      },
      description: {
        type: Type.STRING,
        description: 'Mô tả hoặc diễn giải sản phẩm'
      },
      quantity: {
        type: Type.NUMBER,
        description: 'Số lượng sản phẩm'
      },
      total: {
        type: Type.NUMBER,
        description: 'Thành tiền hoặc tổng giá trị của mục hàng'
      },
    },
    required: ["po", "sku", "description", "quantity", "total"],
  },
};

export const parsePdfPo = async (base64Pdf: string): Promise<Omit<PoItem, 'id'>[]> => {
  try {
    const client = getAiClient();
    const prompt = `Phân tích tệp PDF được cung cấp. Tìm bảng chứa các mặt hàng trong đơn đặt hàng. Trích xuất dữ liệu và trả về một mảng JSON. Mỗi đối tượng trong mảng phải có các khóa sau: 'po', 'sku', 'description', 'quantity', và 'total'. Đảm bảo rằng 'quantity' và 'total' là số. Nếu không tìm thấy bảng, hãy trả về một mảng trống.`;
    
    const filePart = {
      inlineData: {
        data: base64Pdf,
        mimeType: 'application/pdf',
      },
    };
    
    const textPart = {
      text: prompt,
    };

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, filePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.warn("Gemini API returned an empty response.");
        return [];
    }

    const parsedData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("Error parsing PDF with Gemini API:", error);
    // Re-throw so the UI can catch it and display a proper message
    throw error;
  }
};