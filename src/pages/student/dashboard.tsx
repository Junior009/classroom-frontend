import { useGetIdentity, useList } from "@refinedev/core";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ClassDetails, User } from "@/types";

type StudentClass = ClassDetails & { isEnrolled: boolean };

const StudentDashboard = () => {
  const { data: user } = useGetIdentity<User>();
  const classesQuery = useList<StudentClass>({
    resource: "student/classes",
    pagination: { currentPage: 1, pageSize: 100 },
  }).query;
  const classes = classesQuery.data?.data ?? [];
  const enrolledClasses = classes.filter((classItem) => classItem.isEnrolled);
  const subjects = new Set(
    enrolledClasses
      .map((classItem) => classItem.subject?.id ?? classItem.subject?.name)
      .filter((subject): subject is number | string => subject !== undefined),
  );
  const catalogCount = classesQuery.data?.total ?? classes.length;

  const metrics = [
    { label: "Disciplinas", value: String(subjects.size), detail: "Nas tuas turmas", icon: BookOpen, tone: "bg-sky-100 text-sky-800" },
    { label: "Turmas inscritas", value: String(enrolledClasses.length), detail: "Ativas na tua conta", icon: GraduationCap, tone: "bg-emerald-100 text-emerald-800" },
    { label: "Aproveitamento", value: "—", detail: "Sem notas lançadas", icon: TrendingUp, tone: "bg-amber-100 text-amber-800" },
    { label: "Trabalhos entregues", value: "—", detail: "Sem registos de trabalhos", icon: ClipboardCheck, tone: "bg-rose-100 text-rose-800" },
  ];

  return (
    <main className="space-y-8 pb-10">
      <header className="border-b pb-6">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Área do estudante</p>
        <h1 className="page-title">Bem-vindo, {user?.name ?? ""}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acompanha as tuas turmas e consulta a atividade académica da tua conta.
        </p>
      </header>

      <section aria-label="Resumo académico" className="grid grid-cols-1 border-y sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, tone }, index) => (
          <div key={label} className={`flex min-w-0 items-start gap-4 py-5 sm:px-5 ${index > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}>
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-md ${tone}`}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-muted-foreground">{label}</span>
              <span className="mt-1 block text-2xl font-semibold tabular-nums text-foreground">{classesQuery.isLoading ? "…" : value}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">As minhas turmas</h2>
              <p className="mt-1 text-sm text-muted-foreground">Acesso rápido às turmas em que estás inscrito.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/student/classes">Ver turmas<ArrowRight aria-hidden="true" /></Link>
            </Button>
          </div>

          {classesQuery.isLoading ? (
            <p className="border-y py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>
          ) : classesQuery.isError ? (
            <p className="border-y py-8 text-sm text-destructive" role="alert">Não foi possível carregar as tuas turmas.</p>
          ) : enrolledClasses.length === 0 ? (
            <div className="border-y py-8">
              <p className="font-medium">Ainda não tens inscrições em turmas.</p>
              <p className="mt-1 text-sm text-muted-foreground">Consulta o catálogo para ver as turmas disponíveis.</p>
              <Button asChild size="sm" className="mt-4"><Link to="/student/classes">Abrir catálogo</Link></Button>
            </div>
          ) : (
            <ul className="divide-y border-y">
              {enrolledClasses.slice(0, 5).map((classItem) => (
                <li key={classItem.id}>
                  <Link to={`/student/classes/${classItem.id}`} className="flex flex-col gap-3 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-3">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{classItem.name}</span>
                      <span className="mt-1 block truncate text-sm text-muted-foreground">
                        {classItem.subject?.name ?? "Sem disciplina"}{classItem.teacher?.name ? ` · ${classItem.teacher.name}` : ""}
                      </span>
                    </span>
                    <Badge variant={classItem.status === "active" ? "default" : "secondary"} className="w-fit">
                      {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside aria-labelledby="activity-title" className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h2 id="activity-title" className="text-lg font-semibold">Avaliações e trabalhos</h2>
          <p className="mt-1 text-sm text-muted-foreground">Turmas disponíveis no catálogo: {classesQuery.isLoading ? "…" : catalogCount}.</p>
          <div className="mt-5 space-y-4 border-y py-4">
            <div>
              <p className="font-medium">Notas e aproveitamento</p>
              <p className="mt-1 text-sm text-muted-foreground">Ainda não existem notas registadas.</p>
            </div>
            <div className="border-t pt-4">
              <p className="font-medium">Trabalhos entregues</p>
              <p className="mt-1 text-sm text-muted-foreground">Ainda não há trabalhos ou entregas registados.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default StudentDashboard;
