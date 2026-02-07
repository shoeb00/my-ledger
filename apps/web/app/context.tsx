import { createContext, useEffect, useState, useCallback, useContext } from "react";
import { BookResponse, getBook } from "./book/actions/get-books";
import { useUser } from "@clerk/nextjs";

type RolesContextValue = {
  roles: BookResponse[];
  loading: boolean;
  refetchRoles: () => void;
}

const RolesContext = createContext<RolesContextValue | null>(null);

export default function RolesProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    const { data } = await getBook();
    if (data) {
      setRoles(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSignedIn || !isLoaded) return;
    fetchRoles();
  }, [fetchRoles, isSignedIn, isLoaded]);

  return (
    <RolesContext.Provider
      value={{
        roles,
        loading,
        refetchRoles: fetchRoles,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
}

export const useRolesContext = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRolesContext must be used within RolesProvider");
  }
  return context;
};

export const useBookRole = (bookId: string) => {
  const { roles, loading } = useRolesContext();

  if (loading) return { role: null, loading };

  const role = roles.find(r => r.id.toString() === bookId)?.role ?? null;
  return { role, loading };
};
