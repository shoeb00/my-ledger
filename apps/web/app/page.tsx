import Book from './create-book/create-book';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Book />
    </div>
  );
}
