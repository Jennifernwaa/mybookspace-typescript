'use client';

export async function createFeedPost(content: string) {
  const res = await fetch('/api/feed/create', {
    method: 'POST',
    body: JSON.stringify({ content }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to create post');
  }

  return res.json();
}
