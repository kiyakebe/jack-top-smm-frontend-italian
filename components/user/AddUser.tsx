import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreateUserFormData,
  createUserSchema,
  useUsers,
} from "@/hooks/use-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AddUser = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createUser } = useUsers();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmitCreate = async (data: CreateUserFormData) => {
    await createUser.mutateAsync(data);
    setIsCreateDialogOpen(false);
    resetCreate();
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Aggiungi Utente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Nuovo Utente</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo utente alla piattaforma
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmitCreate(onSubmitCreate)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="create-name">Nome Completo</Label>
            <Input id="create-name" {...registerCreate("name")} />
            {errorsCreate.name && (
              <p className="text-sm text-red-600">
                {errorsCreate.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              {...registerCreate("email")}
            />
            {errorsCreate.email && (
              <p className="text-sm text-red-600">
                {errorsCreate.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              {...registerCreate("password")}
            />
            {errorsCreate.password && (
              <p className="text-sm text-red-600">
                {errorsCreate.password.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetCreate();
              }}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createUser.isPending}
            >
              {createUser.isPending ? "Creazione in corso..." : "Crea Utente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
