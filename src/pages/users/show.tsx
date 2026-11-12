import { useShow } from "@refinedev/core";
import { Link } from "react-router";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types";

const roleLabels: Record<User["role"], string> = {
  student: "Estudante",
  teacher: "Professor",
  admin: "Administrador",
};

const UsersShow = () => {
  const { query } = useShow<User>({ resource: "users" });
  const user = query.data?.data;

  if (query.isLoading) {
    return <ShowView><p role="status">A carregar utilizador...</p></ShowView>;
  }

  if (query.isError || !user) {
    return <ShowView><p role="alert" className="text-destructive">Não foi possível carregar este utilizador.</p></ShowView>;
  }

  return (
    <ShowView>
      <Breadcrumb />
      <h1 className="page-title">Detalhes do utilizador</h1>
      <div className="intro-row">
        <p>Informação da conta.</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link to="/users">Voltar à lista</Link></Button>
          <EditButton resource="users" recordItemId={user.id} variant="outline">Editar</EditButton>
          <DeleteButton resource="users" recordItemId={user.id}>Eliminar</DeleteButton>
        </div>
      </div>
      <Separator className="my-4" />
      <dl className="grid max-w-2xl gap-x-8 sm:grid-cols-2">
        <div className="border-b py-4">
          <dt className="text-sm text-muted-foreground">Nome</dt>
          <dd className="mt-1 font-medium">{user.name}</dd>
        </div>
        <div className="border-b py-4">
          <dt className="text-sm text-muted-foreground">E-mail</dt>
          <dd className="mt-1 font-medium">{user.email}</dd>
        </div>
        <div className="border-b py-4">
          <dt className="text-sm text-muted-foreground">Papel</dt>
          <dd className="mt-1 font-medium">{roleLabels[user.role]}</dd>
        </div>
        <div className="border-b py-4">
          <dt className="text-sm text-muted-foreground">Criado em</dt>
          <dd className="mt-1 font-medium">
            {new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(user.createdAt))}
          </dd>
        </div>
      </dl>
    </ShowView>
  );
};

export default UsersShow;
