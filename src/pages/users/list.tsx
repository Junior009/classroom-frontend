import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@/types";

const roleLabels: Record<User["role"], string> = {
  student: "Estudante",
  teacher: "Professor",
  admin: "Administrador",
};

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      id: "name",
      accessorKey: "name",
      size: 220,
      header: () => <p className="column-title">Nome</p>,
      cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue<string>()}</span>,
    },
    {
      id: "email",
      accessorKey: "email",
      size: 260,
      header: () => <p className="column-title">E-mail</p>,
      cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
    },
    {
      id: "role",
      accessorKey: "role",
      size: 160,
      header: () => <p className="column-title">Papel</p>,
      cell: ({ getValue }) => <Badge variant="outline">{roleLabels[getValue<User["role"]>()]}</Badge>,
    },
    {
      id: "actions",
      size: 230,
      enableSorting: false,
      header: () => <p className="column-title">Ações</p>,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ShowButton resource="users" recordItemId={row.original.id} variant="outline" size="sm">Ver</ShowButton>
          <EditButton resource="users" recordItemId={row.original.id} variant="outline" size="sm">Editar</EditButton>
          <DeleteButton resource="users" recordItemId={row.original.id} size="sm">Eliminar</DeleteButton>
        </div>
      ),
    },
  ], []);

  const userTable = useTable<User>({
    columns,
    refineCoreProps: {
      resource: "users",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [
          ...(selectedRole === "all" ? [] : [{ field: "role", operator: "eq" as const, value: selectedRole }]),
          ...(searchQuery.trim() ? [{ field: "name", operator: "contains" as const, value: searchQuery.trim() }] : []),
        ],
      },
      sorters: { initial: [{ field: "createdAt", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Utilizadores</h1>
      <div className="intro-row">
        <p>Crie e gira as contas da plataforma.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search aria-hidden="true" className="search-icon" />
            <Input
              type="search"
              placeholder="Pesquisar por nome..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os papéis</SelectItem>
              <SelectItem value="student">Estudante</SelectItem>
              <SelectItem value="teacher">Professor</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <CreateButton resource="users">Adicionar utilizador</CreateButton>
        </div>
      </div>
      <DataTable table={userTable} />
    </ListView>
  );
};

export default UsersList;
