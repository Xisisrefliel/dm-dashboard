export interface Campaign {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  role?: string;
  docs?: Doc[];
  categories?: Category[];
}

export interface CampaignSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  docCount: number;
  categoryCount: number;
  role: string;
}

export interface Doc {
  id: string;
  title: string;
  category_key?: string;
  category?: string;
  icon: string;
  content: string;
  parent_id?: string | null;
  parentId?: string | null;
  shared_with_party?: boolean;
  children?: Doc[];
}

export interface Category {
  key: string;
  label: string;
  icon: string;
  sort_order?: number;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
}
