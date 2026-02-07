/** Transaction data extracted from natural language */
export interface ParsedTransaction {
  amount: number;
  item: string;
  category: string;
  store?: string;
}
