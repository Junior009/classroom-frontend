import { useList } from "@refinedev/core";
import { ArrowRight, BookOpen, Building2, GraduationCap, Plus, RefreshCw, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { Department, Subject, User } from "@/types";

type DashboardClass = {
  id: number;
  name: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  subject?: { name: string } | null;
  teacher?: { name: string } | null;
};

const statusLabels: Record<DashboardClass["status"], string> = {
  active: "Ativa",
  inactive: "Inativa",
  archived: "Arquivada",
};

const statusStyles: Record<DashboardClass["status"], string> = {
  active: "bg-emerald-50 text-emerald-800",
  inactive: "bg-amber-50 text-amber-800",
  archived: "bg-muted text-muted-foreground",
};

const formatTotal = (value: number | undefined, isLoading: boolean, isError: boolean) => {
  if (isLoading) return "...";
  if (isError) return "—";
  return new Intl.NumberFormat("pt-PT").format(value ?? 0);
};

const Dashboard = () => {
  const classesQuery = useList<DashboardClass>({
    resource: "classes",
    pagination: { currentPage: 1, pageSize: 5 },
  }).query;
  const subjectsQuery = useList<Subject>({
    resource: "subjects",
    pagination: { currentPage: 1, pageSize: 1 },
  }).query;
  const departmentsQuery = useList<Department>({
    resource: "departments",
    pagination: { currentPage: 1, pageSize: 1 },
  }).query;
  const usersQuery = useList<User>({
    resource: "users",
    pagination: { currentPage: 1, pageSize: 1 },
  }).query;

  const metrics = [
    {
      label: "Turmas",
      value: formatTotal(classesQuery.data?.total, classesQuery.isLoading, classesQuery.isError),
      detail: "Registadas na plataforma",
      icon: GraduationCap,
      tone: "bg-sky-100 text-sky-800",
      href: "/classes",
    },
    {
      label: "Disciplinas",
      value: formatTotal(subjectsQuery.data?.total, subjectsQuery.isLoading, subjectsQuery.isError),
      detail: "Disponíveis para associar",
      icon: BookOpen,
      tone: "bg-amber-100 text-amber-800",
      href: "/subjects",
    },
    {
      label: "Departamentos",
      value: formatTotal(departmentsQuery.data?.total, departmentsQuery.isLoading, departmentsQuery.isError),
      detail: "Organizados na instituição",
      icon: Building2,
      tone: "bg-emerald-100 text-emerald-800",
      href: "/departments",
    },
    {
      label: "Contas",
      value: formatTotal(usersQuery.data?.total, usersQuery.isLoading, usersQuery.isError),
      detail: "Utilizadores registados",
      icon: Users,
      tone: "bg-rose-100 text-rose-800",
      href: "/classes",
    },
  ];

  const refreshDashboard = () => {
    void Promise.all([
      classesQuery.refetch(),
      subjectsQuery.refetch(),
      departmentsQuery.refetch(),
      usersQuery.refetch(),
    ]);
  };

  const recentClasses = classesQuery.data?.data ?? [];

  return (
    <main className="space-y-8 pb-10">
      <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Administração</p>
          <h1 className="page-title">Visão geral</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acompanhe os principais registos e aceda rapidamente às áreas da plataforma.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={refreshDashboard}>
          <RefreshCw aria-hidden="true" />
          Atualizar dados
        </Button>
      </header>

      <section aria-label="Métricas da plataforma" className="grid grid-cols-1 border-y sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, tone, href }, index) => (
          <Link
            key={label}
            to={href}
            className={`group flex min-w-0 items-start gap-4 py-5 transition-colors hover:bg-muted/40 sm:px-5 ${
              index > 0 ? "border-t sm:border-l sm:border-t-0" : ""
            } ${index === 2 ? "xl:border-l" : ""}`}
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-md ${tone}`}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-muted-foreground">{label}</span>
              <span className="mt-1 block text-3xl font-semibold tabular-nums text-foreground">{value}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
            </span>
            <ArrowRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Turmas recentes</h2>
              <p className="mt-1 text-sm text-muted-foreground">Últimas turmas adicionadas à plataforma.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/classes">
                Ver todas
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border bg-card">
            {classesQuery.isLoading ? (
              <p className="px-5 py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>
            ) : classesQuery.isError ? (
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-8">
                <p className="text-sm text-destructive" role="alert">Não foi possível carregar as turmas.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void classesQuery.refetch()}>
                  Tentar novamente
                </Button>
              </div>
            ) : recentClasses.length === 0 ? (
              <div className="px-5 py-8">
                <p className="text-sm font-medium text-foreground">Ainda não existem turmas.</p>
                <p className="mt-1 text-sm text-muted-foreground">Crie a primeira turma para começar.</p>
                <Button asChild size="sm" className="mt-4">
                  <Link to="/classes/create"><Plus aria-hidden="true" />Criar turma</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y">
                {recentClasses.map((classItem) => (
                  <li key={classItem.id}>
                    <Link
                      to={`/classes/show/${classItem.id}`}
                      className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground">{classItem.name}</span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">
                          {classItem.subject?.name ?? "Sem disciplina"}
                          <span aria-hidden="true"> · </span>
                          {classItem.teacher?.name ?? "Sem docente"}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[classItem.status] ?? "bg-muted text-muted-foreground"}`}>
                          {statusLabels[classItem.status] ?? classItem.status}
                        </span>
                        <time className="text-xs text-muted-foreground" dateTime={classItem.createdAt}>
                          {new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(classItem.createdAt))}
                        </time>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside aria-labelledby="quick-actions-title" className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h2 id="quick-actions-title" className="text-lg font-semibold text-foreground">Ações rápidas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Continue a gerir a plataforma.</p>
          <div className="mt-5 flex flex-col items-stretch gap-2">
            <Button asChild className="justify-start">
              <Link to="/classes/create"><Plus aria-hidden="true" />Criar turma</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/subjects/create"><Plus aria-hidden="true" />Adicionar disciplina</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/departments/create"><Plus aria-hidden="true" />Adicionar departamento</Link>
            </Button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;