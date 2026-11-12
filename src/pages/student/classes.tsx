import { useState } from "react";
import { useList } from "@refinedev/core";
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { ClassDetails } from "@/types";

type StudentClass = ClassDetails & { isEnrolled: boolean };

const StudentClasses = () => {
  const [search, setSearch] = useState("");
  const classesQuery = useList<StudentClass>({
    resource: "student/classes",
    pagination: { currentPage: 1, pageSize: 100 },
    filters: search.trim()
      ? [{ field: "name", operator: "contains", value: search.trim() }]
      : [],
  }).query;
  const classes = classesQuery.data?.data ?? [];

  return (
    <main className="space-y-6 pb-10">
      <Breadcrumb />
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Área do estudante</p>
          <h1 className="page-title">Turmas</h1>
          <p className="mt-2 text-sm text-muted-foreground">Consulta as tuas inscrições e explora as turmas ativas.</p>
        </div>
        <label className="relative w-full sm:max-w-sm">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar turmas, disciplinas ou docentes"
            className="pl-9"
            aria-label="Pesquisar turmas"
          />
        </label>
      </header>

      {classesQuery.isLoading ? (
        <p className="border-y py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>
      ) : classesQuery.isError ? (
        <p className="border-y py-8 text-sm text-destructive" role="alert">Não foi possível carregar as turmas.</p>
      ) : classes.length === 0 ? (
        <p className="border-y py-8 text-sm text-muted-foreground">Não há turmas disponíveis para esta pesquisa.</p>
      ) : (
        <ul className="divide-y border-y">
          {classes.map((classItem) => (
            <li key={classItem.id}>
              <Link to={`/student/classes/${classItem.id}`} className="group flex flex-col gap-3 py-5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{classItem.name}</span>
                  <span className="mt-1 block truncate text-sm text-muted-foreground">
                    {classItem.subject?.name ?? "Sem disciplina"}
                    {classItem.teacher?.name ? ` · ${classItem.teacher.name}` : ""}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge variant={classItem.isEnrolled ? "default" : "outline"}>
                    {classItem.isEnrolled ? "Inscrito" : "Disponível"}
                  </Badge>
                  <Badge variant={classItem.status === "active" ? "secondary" : "outline"}>
                    {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
                  </Badge>
                  <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default StudentClasses;
