export interface Transaction {
  id?: number;
  phone_number: string;
  amount: number;
  item: string;
  category: string;
  store?: string;
  created_at?: string;
}

export interface ParsedTransaction {
  amount: number;
  item: string;
  category: string;
  store?: string;
}

export interface Summary {
  total_spent: number;
  transactions_count: number;
  categories: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}
