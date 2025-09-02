import React, { useState } from "react";
import { useUsers } from "@/hooks/use-users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { EmptyState } from "./EmpityState";
import { Users } from "lucide-react";
import { format } from "@/lib/date-utils";

const UsersList = () => {
  const { users, isLoading } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-4 rounded-lg border mb-10">
      <h2 className="text-2xl font-bold mb-4">Elenco Utenti</h2>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[50px] w-full rounded-lg" />
          ))}
        </div>
      ) : paginatedUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nessun utente registrato"
          description="Non ci sono utenti da mostrare al momento."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Aggiornato il</TableHead>
                <TableHead className="w-[100px]">Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {format(new Date(user.updatedAt), "dd MMM, yyyy")}
                  </TableCell>
                  <TableCell>{user.isBanned ? "Bloccato" : "Attivo"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-5">
            <div className="flex justify-between items-center gap-4 mt-4 ml-auto">
              <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Precedente
              </Button>
              <span>
                Pagina {currentPage} di {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Successiva
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
