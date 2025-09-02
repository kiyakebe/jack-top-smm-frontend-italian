"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "@/lib/date-utils";
import {
  updateUserSchema,
  useUsers,
  type UpdateUserFormData,
} from "@/hooks/use-users";
import { toast } from "react-toastify";
import { User } from "@/types/api";
import { Switch } from "@/components/ui/switch";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { users, isLoading, updateUser, deleteUser, banUser, unBanUser } =
    useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setRoleFilter] = useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [banUnban, setBanUnban] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBanUnban = async (userId: string, isBanned: boolean) => {
    setBanUnban(true);
    try {
      if (isBanned) {
        await unBanUser.mutateAsync(userId);
      } else {
        await banUser.mutateAsync(userId);
      }
      setBanUnban(false);
    } catch (error) {
      console.log(error);
      setBanUnban(false);
    }
  };

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { errors: errorsUpdate },
    reset: resetUpdate,
    setValue: setValueUpdate,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        activityFilter === "all" ||
        user.isBanned === (activityFilter == "banned");

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, activityFilter]);

  // pagination
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const regularUsers = users.filter((user) => user.role === "user").length;
    const recentUsers = users.filter(
      (user) =>
        new Date(user.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return {
      totalUsers,
      regularUsers,
      recentUsers,
    };
  }, [users]);

  const onSubmitUpdate = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;

    // Remove empty fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        (entry) => entry[1] !== "" && entry[1] !== undefined
      )
    );

    await updateUser.mutateAsync({ id: selectedUser._id, userData: cleanData });
    setIsEditDialogOpen(false);
    resetUpdate();
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setValueUpdate("name", user.name);
    setValueUpdate("email", user.email);
    setValueUpdate("role", user.role);
    setIsEditDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (user._id === currentUser?._id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    await deleteUser.mutateAsync(user._id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestione Utenti</h1>
          <p className="text-muted-foreground">
            Gestisci account e permessi degli utenti
          </p>
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utenti Totali</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Tutti gli utenti registrati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utenti Regolari
            </CardTitle>
            <UserIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "user").length}
            </div>
            <p className="text-xs text-muted-foreground">Account standard</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuovi Questa Settimana
            </CardTitle>
            <UserPlus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                users.filter(
                  (u) =>
                    new Date(u.createdAt) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Appena iscritti</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtri e Ricerca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca per nome o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={activityFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtra per stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli utenti</SelectItem>
                <SelectItem value="active">Attivi</SelectItem>
                <SelectItem value="banned">Bloccati</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabella Utenti */}
      <Card>
        <CardHeader>
          <CardTitle>Tutti gli Utenti</CardTitle>
          <CardDescription>Elenco degli account registrati</CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utente</TableHead>
                    <TableHead>Registrato</TableHead>
                    <TableHead>Ultimo Aggiornamento</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(new Date(user.createdAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(user.createdAt), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(new Date(user.updatedAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(user.updatedAt), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-28">
                        <div className="flex gap-2 items-center">
                          <Switch
                            checked={!user.isBanned}
                            disabled={banUnban}
                            onClick={() => {
                              handleBanUnban(user._id, user.isBanned);
                            }}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {user._id !== currentUser?._id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {user.name}?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nessun utente trovato
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || activityFilter !== "all"
                  ? "Prova a modificare i criteri di ricerca o filtro"
                  : "Nessun utente registrato finora"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Modifica Utente */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Utente</DialogTitle>
            <DialogDescription>
              Aggiorna le informazioni e i permessi dell&apos;utente
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Dialog Dettagli Utente */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli Utente</DialogTitle>
            <DialogDescription>
              Informazioni complete per {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
