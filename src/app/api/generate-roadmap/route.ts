import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
// The system instructions specify using NEXT_PUBLIC_GEMINI_API_KEY for the Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { currentSkills, targetRole } = await request.json();

    if (!currentSkills || !targetRole) {
      return NextResponse.json({ error: 'Missing currentSkills or targetRole' }, { status: 400 });
    }

    const prompt = `Current Skills: ${currentSkills}\nTarget Role: ${targetRole}\nGenerate a step-by-step career roadmap.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a career navigation AI. Return ONLY valid JSON. Schema: { "baseline_recognized": "String", "target_role": "String", "roadmap": { "Foundation": [ {"step": "String", "skills": ["Skill 1"]} ], "Ascent": [ {"step": "String", "skills": ["Skill 1"]} ], "Mastery": [ {"step": "String", "skills": ["Skill 1"]} ] } }',
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
  }
}
