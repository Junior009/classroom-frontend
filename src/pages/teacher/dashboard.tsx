import { useEffect, useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { ArrowRight, BookOpen, ClipboardCheck, GraduationCap, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { teacherRequest } from "@/providers/teacher";
import type { User } from "@/types";

type TeacherDashboardData = {
  classCount: number;
  studentCount: number;
  attendanceRate: number;
  averageGrade: number;
  gradeCount: number;
  classes: Array<{
    id: number;
    name: string;
    status: "active" | "inactive" | "archived";
    studentCount: number;
  }>;
};

const formatPercent = (value: number) =>
  `${new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(value)}%`;

const TeacherDashboard = () => {
  const { data: user } = useGetIdentity<User>();
  const [dashboard, setDashboard] = useState<TeacherDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    teacherRequest<TeacherDashboardData>("dashboard")
      .then((result) => {
        if (isCurrent) setDashboard(result);
      })
      .catch(() => {
        if (isCurrent) setHasError(true);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const metrics = [
    { label: "Turmas", value: dashboard?.classCount ?? 0, detail: "Atribuídas ao teu perfil", icon: GraduationCap, tone: "bg-sky-100 text-sky-800" },
    { label: "Estudantes", value: dashboard?.studentCount ?? 0, detail: "Inscritos nas tuas turmas", icon: UsersRound, tone: "bg-emerald-100 text-emerald-800" },
    { label: "Presenças", value: dashboard ? formatPercent(dashboard.attendanceRate) : "—", detail: "Presente ou atrasado", icon: ClipboardCheck, tone: "bg-amber-100 text-amber-800" },
    { label: "Média das notas", value: dashboard?.gradeCount ? formatPercent(dashboard.averageGrade) : "—", detail: dashboard?.gradeCount ? `${dashboard.gradeCount} notas lançadas` : "Sem notas lançadas", icon: BookOpen, tone: "bg-rose-100 text-rose-800" },
  ];

  return (
    <main className="space-y-8 pb-10">
      <header className="border-b pb-6">
        <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Área do professor</p>
        <h1 className="page-title">Bem-vindo, {user?.name ?? ""}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Resumo das tuas turmas e da atividade académica.</p>
      </header>

      {hasError ? (
        <p className="border-y py-5 text-sm text-destructive" role="alert">Não foi possível carregar as métricas do professor.</p>
      ) : (
        <section aria-label="Métricas do professor" className="grid grid-cols-1 border-y sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, detail, icon: Icon, tone }, index) => (
            <div key={label} className={`flex min-w-0 items-start gap-4 py-5 sm:px-5 ${index > 0 ? "border-t sm:border-l sm:border-t-0" : ""}`}>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-md ${tone}`}>
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-muted-foreground">{label}</span>
                <span className="mt-1 block text-2xl font-semibold tabular-nums text-foreground">
                  {isLoading ? "…" : value}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{detail}</span>
              </span>
            </div>
          ))}
        </section>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">As minhas turmas</h2>
            <p className="mt-1 text-sm text-muted-foreground">Abre uma turma para gerir inscrições, presenças e notas.</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/teacher/classes">Ver todas<ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>

        {isLoading ? (
          <p className="border-y py-8 text-sm text-muted-foreground" role="status">A carregar turmas...</p>
        ) : hasError ? (
          <p className="border-y py-8 text-sm text-destructive" role="alert">Não foi possível carregar as tuas turmas.</p>
        ) : dashboard?.classes.length ? (
          <ul className="divide-y border-y">
            {dashboard.classes.slice(0, 5).map((classItem) => (
              <li key={classItem.id}>
                <Link to={`/teacher/classes/${classItem.id}`} className="group flex flex-col gap-3 py-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{classItem.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{classItem.studentCount} estudantes inscritos</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                      {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
                    </Badge>
                    <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-y py-8 text-sm text-muted-foreground">Ainda não tens turmas atribuídas.</p>
        )}
      </section>
    </main>
  );
};

export default TeacherDashboard;
