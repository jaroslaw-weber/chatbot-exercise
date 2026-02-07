import { ParsedTransaction } from "../types/transaction.js";
import { token } from "./config.js";
import { PARSER_PROMPT } from "./prompts.js";

export async function parseTransaction(
  text: string,
): Promise<ParsedTransaction | null> {
  try {
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
    //console.log("response", data);
    const outputText = Array.isArray(data.output)
      ? data.output.join("")
      : data.output || "";

    const jsonMatch = outputText.match(/\{[^}]+\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", outputText);
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.amount || !parsed.item || !parsed.category) {
      console.error("Missing required fields in parsed transaction:", parsed);
      return null;
    }

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
