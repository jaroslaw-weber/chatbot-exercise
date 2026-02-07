import { ParsedTransaction } from "../types/transaction.js";

const token = Bun.env.REPLICATE_API_TOKEN;
if (!token) {
  throw new Error("REPLICATE_API_TOKEN is not set");
}

if (token.startsWith("your_")) {
  throw new Error(
    "REPLICATE_API_TOKEN is not set correctly. It should not start with 'your_'",
  );
}
console.log(
  "🔑 Token loaded :",
  token ? `YES (${token.substring(0, 10)}...)` : "NO",
);

const PARSER_PROMPT = `You are a transaction parser. Extract transaction details from natural language text and return valid JSON.

Examples:
- "I bought coffee for $5.50 at Starbucks" -> {"amount": 5.5, "item": "coffee", "category": "food", "store": "Starbucks"}
- "spent $20 on groceries" -> {"amount": 20, "item": "groceries", "category": "food", "store": null}
- "paid $45 for gas" -> {"amount": 45, "item": "gas", "category": "transport", "store": null}
- "bought new shoes $80" -> {"amount": 80, "item": "shoes", "category": "shopping", "store": null}

Categories should be one of: food, transport, shopping, entertainment, utilities, health, other

Parse the following text and return only valid JSON:
`;

export async function parseTransaction(
  text: string,
): Promise<ParsedTransaction | null> {
  try {
    const response = await fetch(
      "https://api.replicate.com/v1/models/openai/o4-mini/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Prefer": "wait",
        },
        body: JSON.stringify({
          input: {
            prompt: `${PARSER_PROMPT}\n\n${text}`,
            max_completion_tokens: 200,
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const outputText = Array.isArray(data.output) ? data.output.join("") : data.output || "";

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
