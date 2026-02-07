import { ParsedTransaction } from "../types/transaction.js";
import { token } from "./config.js";
import { PARSER_PROMPT } from "./prompts.js";

/**
 * Parses a natural language transaction description using AI.
 * Sends the text to the Replicate API with a structured prompt and extracts
 * transaction details (amount, item, category, store) from the response.
 * @param text - The natural language text describing a transaction
 * @returns A promise that resolves to the parsed transaction or null if parsing fails
 */
export async function parseTransaction(
  text: string,
): Promise<ParsedTransaction | null> {
  try {
    // Send request to Replicate API with the parser prompt
    const response = await fetch(
      "https://api.replicate.com/v1/models/openai/o4-mini/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({
          input: {
            prompt: `${PARSER_PROMPT}\n\n${text}`,
            max_completion_tokens: 600,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${response.status} ${error}`);
    }

    const data = await response.json();

    // Handle both array and string output formats
    const outputText = Array.isArray(data.output)
      ? data.output.join("")
      : data.output || "";

    // Extract JSON object from the AI response
    const jsonMatch = outputText.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", outputText);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate that required fields are present
    if (!parsed.amount || !parsed.item || !parsed.category) {
      console.error("Missing required fields in parsed transaction:", parsed);
      return null;
    }

    // Return the normalized transaction data
    return {
      amount: Number(parsed.amount),
      item: parsed.item.trim(),
      category: parsed.category.trim().toLowerCase(),
      store: parsed.store?.trim() || null,
    };
  } catch (error) {
    console.error("Error parsing transaction:", error);
    return null;
  }
}
