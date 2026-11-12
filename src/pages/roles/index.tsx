import { useList, useGetIdentity } from "@refinedev/core";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClassDetails, User } from "@/types";

type Role = "student" | "teacher";

const roleCopy = {
  student: {
    title: "Área do estudante",
    description: "Consulte as turmas disponíveis na plataforma.",
    classesTitle: "Turmas disponíveis",
    classesDescription: "Explore as turmas publicadas no Classroom.",
    link: "/student/classes",
    linkLabel: "Ver catálogo de turmas",
  },
  teacher: {
    title: "Área do professor",
    description: "Acompanhe as turmas associadas à sua conta.",
    classesTitle: "As minhas turmas",
    classesDescription: "Turmas atribuídas ao seu perfil de professor.",
    link: "/teacher/classes",
    linkLabel: "Ver todas as minhas turmas",
  },
} satisfies Record<Role, {
  title: string;
  description: string;
  classesTitle: string;
  classesDescription: string;
  link: string;
  linkLabel: string;
}>;

function useRoleClasses(role: Role, pageSize: number) {
  const { data: user } = useGetIdentity<User>();
  return useList<ClassDetails>({
    resource: "classes",
    pagination: { currentPage: 1, pageSize },
    filters: role === "teacher"
      ? [{ field: "teacherId", operator: "eq", value: user?.id ?? " " }]
      : [],
  }).query;
}

export function RoleDashboard({ role }: { role: Role }) {
  const copy = roleCopy[role];
  const { data: user } = useGetIdentity<User>();
  const classesQuery = useRoleClasses(role, 5);
  const classes = classesQuery.data?.data ?? [];

  return (
    <main className="space-y-8 pb-10">
      <header className="border-b pb-6">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom</p>
        <h1 className="page-title">Bem-vindo, {user?.name ?? ""}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
      </header>

      <section aria-labelledby="role-classes-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="role-classes-title" className="text-lg font-semibold">{copy.classesTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy.classesDescription}</p>
          </div>
          <Button asChild variant="outline">
            <Link to={copy.link}>{copy.linkLabel}<ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
        <ClassRows classes={classes} isLoading={classesQuery.isLoading} isError={classesQuery.isError} />
      </section>
    </main>
  );
}

export function RoleClasses({ role }: { role: Role }) {
  const copy = roleCopy[role];
  const classesQuery = useRoleClasses(role, 100);
  const classes = classesQuery.data?.data ?? [];

  return (
    <main className="space-y-6 pb-10">
      <header className="border-b pb-6">
        <h1 className="page-title">{copy.classesTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{copy.classesDescription}</p>
      </header>
      <ClassRows classes={classes} isLoading={classesQuery.isLoading} isError={classesQuery.isError} />
    </main>
  );
}

function ClassRows({
  classes,
  isLoading,
  isError,
}: {
  classes: ClassDetails[];
  isLoading: boolean;
  isError: boolean;
}) {
  if (isLoading) return <p className="py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>;
  if (isError) return <p className="py-8 text-sm text-destructive" role="alert">Não foi possível carregar as turmas.</p>;
  if (classes.length === 0) {
    return <p className="border-y py-8 text-sm text-muted-foreground">Ainda não existem turmas para apresentar.</p>;
  }

  return (
    <ul className="divide-y border-y">
      {classes.map((classItem) => (
        <li key={classItem.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-800">
              {classItem.subject?.name ? <BookOpen aria-hidden="true" className="size-5" /> : <GraduationCap aria-hidden="true" className="size-5" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{classItem.name}</span>
              <span className="mt-1 block truncate text-sm text-muted-foreground">
                {classItem.subject?.name ?? "Sem disciplina"}
                {classItem.teacher?.name ? ` · ${classItem.teacher.name}` : ""}
              </span>
            </span>
          </div>
          <Badge variant={classItem.status === "active" ? "default" : "secondary"} className="w-fit">
            {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
          </Badge>
        </li>
      ))}
    </ul>
  );
}