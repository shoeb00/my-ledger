'use server';

export default async function createBook(formData: FormData) {
  await fetch(`${process.env.API_URL}/v1/book/get`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
}
