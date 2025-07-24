export interface SnippetCreate {
  plain_text: string;
  language: string;
  password?: string;
  expiry_time?: string;
  one_time_view?: boolean;
  created_at?: string
}

export interface SnippetResponse {
  slug: string;
  decrypted: string;
  language: string;
  expiry_time: string;
  one_time_view: boolean;
  created_at: string
}
