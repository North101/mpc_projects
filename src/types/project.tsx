type Project = {
  filename: string;
  name: string;
  description: string;
  content: string;
  website: string|null;
  created: Date;
  updated: Date;
  authors: string[];
  tags: string[];
  info: string | null;
  cardCount: number;
}
