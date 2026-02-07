/**
 * Interface representing a parsed transaction extracted from natural language.
 * Contains the essential details needed to record a financial transaction.
 */
export interface ParsedTransaction {
  /**
   * The monetary amount of the transaction.
   */
  amount: number;

  /**
   * Description of the item or service that was purchased.
   */
  item: string;

  /**
   * The category classification for the transaction (e.g., food, transport).
   */
  category: string;

  /**
   * Optional name of the store or merchant where the transaction occurred.
   */
  store?: string;
}
