export async function createBook(formData: FormData) {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/book/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
    credentials: 'include',
  });
}
