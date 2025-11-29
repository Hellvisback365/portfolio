import documents from '@/content/profile/documents.json';

export interface ProfileDocument {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  updatedAt: string;
}

export function getProfileDocuments(): ProfileDocument[] {
  return (documents as ProfileDocument[]).map((doc) => ({
    ...doc,
    body: doc.body.trim(),
    tags: doc.tags ?? [],
  }));
}
