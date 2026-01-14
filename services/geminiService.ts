
import { GoogleGenAI } from "@google/genai";
import { TreeParams } from '../types';

export const getTreeInsights = async (params: TreeParams): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert botanist teaching students about Leonardo da Vinci's Rule of Trees and plant hydraulic architecture.
      
      Current Model Parameters:
      - Species: ${params.species}
      - Trunk Girth (Starting Radius): ${params.trunkThickness}
      - Branch Mass Scalar: ${params.branchThickness}x (multiplied against Leonardo's theoretical prediction)
      - Leonardo Exponent (n): ${params.exponent}
      
      Leonardo's rule (exponent n=2) suggests area is conserved to optimize water flow.
      
      Explain in 2 sentences how the current combination of trunk girth and branch mass affects the tree's structural "believability." 
      If the branch mass is high (>1.0) while the trunk is thin, note that the tree would likely collapse under its own weight in the real world. 
      Keep the tone educational, encouraging, and scientifically grounded.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Nature follows many patterns. Explore the sliders to find the balance between math and biology.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The forest is quiet right now. Check your parameters to see how the geometry shifts!";
  }
};
