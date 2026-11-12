import { useList } from "@refinedev/core";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import type { ClassDetails } from "@/types";

type TeacherClass = ClassDetails;

const TeacherClasses = () => {
  const classesQuery = useList<TeacherClass>({
    resource: "teacher/classes",
    pagination: { currentPage: 1, pageSize: 100 },
    sorters: [{ field: "name", order: "asc" }],
  }).query;
  const classes = classesQuery.data?.data ?? [];

  return (
    <main className="space-y-6 pb-10">
      <Breadcrumb />
      <header className="border-b pb-6">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Área do professor</p>
        <h1 className="page-title">As minhas turmas</h1>
        <p className="mt-2 text-sm text-muted-foreground">Gere estudantes, presenças e avaliações de cada turma.</p>
      </header>

      {classesQuery.isLoading ? (
        <p className="border-y py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>
      ) : classesQuery.isError ? (
        <p className="border-y py-8 text-sm text-destructive" role="alert">Não foi possível carregar as turmas.</p>
      ) : classes.length === 0 ? (
        <p className="border-y py-8 text-sm text-muted-foreground">Ainda não tens turmas atribuídas.</p>
      ) : (
        <ul className="divide-y border-y">
          {classes.map((classItem) => (
            <li key={classItem.id}>
              <Link to={`/teacher/classes/${classItem.id}`} className="group flex flex-col gap-3 py-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{classItem.name}</span>
                  <span className="mt-1 block truncate text-sm text-muted-foreground">
                    {classItem.subject?.name ?? "Sem disciplina"}
                    {classItem.capacity ? ` · Capacidade ${classItem.capacity}` : ""}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                    {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary">Gerir<ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default TeacherClasses;
