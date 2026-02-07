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

export { token };
