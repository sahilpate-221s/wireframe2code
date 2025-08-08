import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import OpenAI from "openai"

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
})

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const { model, description, imageUrl } = await req.json();

        if (!model || !description || !imageUrl) {
            return new Response(
                JSON.stringify({ error: "Missing required parameters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const ModelObj = Constants.AiModelList.find(item => item.name === model);
        const modelName = ModelObj?.modelName || 'google/gemini-2.0-pro-exp-02-05:free';
        
        console.log("Using model:", modelName);

        const response = await openai.chat.completions.create({
            model: modelName,
            stream: true,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Generate complete HTML, CSS, and JavaScript code based on this wireframe image and description: ${description}. Return only the code without any explanations or markdown formatting.`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ]
        });

        // Create a readable stream to send data in real-time
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        if (text) {
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });

    } catch (error) {
        console.error("AI Model API Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate code", details: String(error) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
