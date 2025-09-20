import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

const generatePrompt = ({
  question,
  content,
  userAnswer,
}: {
  question: string;
  content: string;
  userAnswer: string;
}) => {
  return `Generate a markdown-formatted response to the following question: "${question}".

Consider the provided context:
**Context:** ${content}

Also, prioritize and incorporate the user's answer when formulating your response:
**User's Answer:** ${userAnswer}

Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
Provide the final answer in markdown format.`;
};

const generateSystem = () => {
  return `You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary.
For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).
`;
};

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      //   model: openai("chatgpt-4o-latest"),
      // model: google("gemini-2.5-pro-exp-03-25"),
      model: google("gemini-2.0-flash-lite"),
      prompt: generatePrompt({ question, content, userAnswer }),
      system: generateSystem(),
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
