export interface PoDetails {
  po_id: string;
  poname: string;
  projectName: string;
  date: string;
  items: Items[];
  filename: string;
}

interface Items {
  index: number;
  po_description: string;
  amount: string;
}
