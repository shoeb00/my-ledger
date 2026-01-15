import { createContext, useContext, useEffect, useState } from "react";
import { BookResponse, getBook } from './book/actions/get-books';
import { toast } from 'sonner';

type RolesContextValue = {
  roles: BookResponse[];
  loading: boolean;
}

const RolesContext = createContext<RolesContextValue | null>(null);

export default function RolesProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { err, data } = await getBook();
      if (err) {
        toast.error(err);
      } else {
        setRoles(data);
      }
      setLoading(false);
    })()
  }, []);

  return (
    <RolesContext.Provider value={{ roles, loading }}>
      {children}
    </RolesContext.Provider>
  );
}

export const useRolesContext = (bookId: string) => {
  const context = useContext(RolesContext);
  if (!context) {
    const message = `No context found for bookId: ${bookId}`
    toast.error(message);
    throw new Error(message);
  }

  const { roles, loading } = context;
  if(loading) return { role: null, loading };
  const role = roles.find(role => role.id.toString() === bookId)?.role;
  if (!role) {
    const message = `No role found for bookId: ${bookId}`
    toast.error(message);
    throw new Error(message);
  }
  return { role, loading };
}