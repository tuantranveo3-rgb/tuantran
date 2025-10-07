import { GoogleGenAI, Type } from "@google/genai";
import { PoItem } from '../types';

// Khởi tạo AI client một cách lười biếng.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (ai) return ai;

    // Sử dụng VITE_GEMINI_API_KEY để tương thích với cấu hình Vercel/Netlify
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

    if (!GEMINI_API_KEY) {
        throw new Error("API Key for Gemini is not set. Please ensure VITE_GEMINI_API_KEY is configured.");
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
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