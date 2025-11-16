import CreateBook from '../book/create-book';
import { DataTableDemo } from '../book/get-books';

export default function Home() {
  return (
    <div className="p-10 border-solid border-gray-400">
      <DataTableDemo />
      <CreateBook />
    </div>
  );
}
