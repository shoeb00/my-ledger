'use client';
import { useParams } from 'next/navigation';

export default function BookInfo() {
  const { bookId } = useParams();
  return <h1>Book {bookId}</h1>;
}
