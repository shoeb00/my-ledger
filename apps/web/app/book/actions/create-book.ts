'use server';

export default async function createBook(formData: FormData) {
  await fetch(`${process.env.API_URL}/v1/book/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
