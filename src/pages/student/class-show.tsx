import { useShow } from "@refinedev/core";
import { Link } from "react-router";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ClassDetails } from "@/types";

type StudentClass = ClassDetails & { isEnrolled: boolean };

const StudentClassShow = () => {
  const { query } = useShow<StudentClass>({ resource: "student/classes" });
  const classItem = query.data?.data;

  if (query.isLoading) {
    return <ShowView><p role="status" className="py-8 text-sm text-muted-foreground">A carregar turma...</p></ShowView>;
  }

  if (query.isError || !classItem) {
    return <ShowView><p role="alert" className="py-8 text-sm text-destructive">Não foi possível carregar esta turma.</p></ShowView>;
  }

  return (
    <ShowView>
      <Breadcrumb />
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Turma</p>
          <h1 className="page-title">{classItem.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{classItem.subject?.name ?? "Sem disciplina"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={classItem.isEnrolled ? "default" : "outline"}>
            {classItem.isEnrolled ? "Inscrito" : "Disponível"}
          </Badge>
          <Badge variant={classItem.status === "active" ? "secondary" : "outline"}>
            {classItem.status === "active" ? "Ativa" : classItem.status === "archived" ? "Arquivada" : "Inativa"}
          </Badge>
          <Button asChild variant="outline"><Link to="/student/classes">Voltar às turmas</Link></Button>
        </div>
      </div>

      <section className="grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Sobre a turma</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {classItem.description || "Não foi adicionada uma descrição."}
            </p>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">Horário</h2>
            {classItem.schedules?.length ? (
              <ul className="mt-3 divide-y border-y">
                {classItem.schedules.map((schedule, index) => (
                  <li key={`${schedule.day}-${schedule.startTime}-${index}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.startTime}–{schedule.endTime}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Ainda não há horário definido.</p>
            )}
          </div>
        </div>

        <aside className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h2 className="text-lg font-semibold">Informação</h2>
          <dl className="mt-3 divide-y border-y">
            <div className="py-3">
              <dt className="text-xs text-muted-foreground">Docente</dt>
              <dd className="mt-1 text-sm font-medium">{classItem.teacher?.name ?? "Por atribuir"}</dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-muted-foreground">Departamento</dt>
              <dd className="mt-1 text-sm font-medium">{classItem.department?.name ?? "Não definido"}</dd>
            </div>
            <div className="py-3">
              <dt className="text-xs text-muted-foreground">Capacidade</dt>
              <dd className="mt-1 text-sm font-medium">{classItem.capacity} estudantes</dd>
            </div>
          </dl>
        </aside>
      </section>
    </ShowView>
  );
};

export default StudentClassShow;
