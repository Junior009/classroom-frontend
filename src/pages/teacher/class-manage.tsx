import { useEffect, useState } from "react";
import { useShow } from "@refinedev/core";
import { Link, useParams } from "react-router";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { teacherRequest } from "@/providers/teacher";
import type { ClassDetails } from "@/types";

type AttendanceStatus = "present" | "absent" | "late" | "excused";
type RosterStudent = { id: string; name: string; email: string; isEnrolled: boolean };
type AttendanceEntry = { id: string; name: string; email: string; status: AttendanceStatus | null; note: string | null };
type GradeEntry = {
  id: number;
  assessmentName: string;
  score: number;
  maxScore: number;
  assessmentDate: string;
  feedback: string | null;
  student: { id: string; name: string; email: string };
};

const today = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const statusLabels: Record<AttendanceStatus, string> = {
  present: "Presente",
  absent: "Falta",
  late: "Atrasado",
  excused: "Justificado",
};

const TeacherClassManage = () => {
  const { id } = useParams();
  const classId = Number(id);
  const { query } = useShow<ClassDetails>({ resource: "classes", id: classId });
  const classItem = query.data?.data;
  const [roster, setRoster] = useState<RosterStudent[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(today());
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(today());
  const [gradeStudentId, setGradeStudentId] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("20");
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshRoster = async () => {
    const result = await teacherRequest<RosterStudent[]>(`classes/${classId}/students`);
    setRoster(result);
  };

  const refreshGrades = async () => {
    const result = await teacherRequest<GradeEntry[]>(`classes/${classId}/grades`);
    setGrades(result);
  };

  useEffect(() => {
    if (!Number.isInteger(classId) || classId < 1) return;
    let isCurrent = true;
    Promise.all([
      teacherRequest<RosterStudent[]>(`classes/${classId}/students`),
      teacherRequest<GradeEntry[]>(`classes/${classId}/grades`),
    ])
      .then(([studentsResult, gradesResult]) => {
        if (!isCurrent) return;
        setRoster(studentsResult);
        setGrades(gradesResult);
      })
      .catch((error: unknown) => {
        if (isCurrent) setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar os dados da turma.");
      });
    return () => { isCurrent = false; };
  }, [classId]);

  useEffect(() => {
    if (!Number.isInteger(classId) || classId < 1 || !attendanceDate) return;
    let isCurrent = true;
    teacherRequest<AttendanceEntry[]>(`classes/${classId}/attendance?date=${encodeURIComponent(attendanceDate)}`)
      .then((result) => {
        if (isCurrent) setAttendance(result.map((entry) => ({ ...entry, status: entry.status ?? "present" })));
      })
      .catch((error: unknown) => {
        if (isCurrent) setErrorMessage(error instanceof Error ? error.message : "Não foi possível carregar as presenças.");
      });
    return () => { isCurrent = false; };
  }, [classId, attendanceDate]);

  const saveEnrollment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudent) return;
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      await teacherRequest(`classes/${classId}/students`, {
        method: "POST",
        body: JSON.stringify({ studentId: selectedStudent }),
      });
      await refreshRoster();
      setSelectedStudent("");
      setMessage("Estudante inscrito na turma.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível inscrever o estudante.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeEnrollment = async (studentId: string) => {
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      await teacherRequest(`classes/${classId}/students/${encodeURIComponent(studentId)}`, { method: "DELETE" });
      await refreshRoster();
      setMessage("Inscrição removida.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível remover a inscrição.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      await teacherRequest(`classes/${classId}/attendance`, {
        method: "PUT",
        body: JSON.stringify({ date: attendanceDate, records: attendance.map(({ id: studentId, status, note }) => ({ studentId, status, note })) }),
      });
      setMessage("Presenças guardadas.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível guardar as presenças.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveGrade = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      await teacherRequest(`classes/${classId}/grades`, {
        method: "POST",
        body: JSON.stringify({
          studentId: gradeStudentId,
          assessmentName,
          score: Number(score),
          maxScore: Number(maxScore),
          assessmentDate,
          feedback,
        }),
      });
      await refreshGrades();
      setMessage("Nota guardada.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível guardar a nota.");
    } finally {
      setIsSaving(false);
    }
  };

  const availableStudents = roster.filter((student) => !student.isEnrolled);
  const enrolledStudents = roster.filter((student) => student.isEnrolled);

  if (query.isLoading) return <main className="py-8 text-sm text-muted-foreground" role="status">A carregar turma...</main>;
  if (query.isError || !classItem) return <main className="py-8 text-sm text-destructive" role="alert">Não foi possível carregar esta turma.</main>;

  return (
    <main className="space-y-6 pb-10">
      <Breadcrumb />
      <header className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase text-primary">Classroom · Gestão da turma</p>
          <h1 className="page-title">{classItem.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{classItem.subject?.name ?? "Sem disciplina"}</p>
        </div>
        <Button asChild variant="outline"><Link to="/teacher/classes">Voltar às turmas</Link></Button>
      </header>

      {message && <p className="text-sm text-emerald-700" role="status">{message}</p>}
      {errorMessage && <p className="text-sm text-destructive" role="alert">{errorMessage}</p>}

      <Tabs defaultValue="students" className="space-y-5">
        <TabsList>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
          <TabsTrigger value="attendance">Presenças</TabsTrigger>
          <TabsTrigger value="grades">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <section className="max-w-2xl">
            <h2 className="text-lg font-semibold">Inscrever estudante</h2>
            <p className="mt-1 text-sm text-muted-foreground">Vagas disponíveis: {Math.max(0, classItem.capacity - enrolledStudents.length)}.</p>
            <form onSubmit={saveEnrollment} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="sm:max-w-sm"><SelectValue placeholder="Selecionar estudante" /></SelectTrigger>
                <SelectContent>
                  {availableStudents.map((student) => <SelectItem key={student.id} value={student.id}>{student.name} · {student.email}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button type="submit" disabled={isSaving || !selectedStudent || enrolledStudents.length >= classItem.capacity}>Inscrever</Button>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Inscritos</h2>
                <p className="mt-1 text-sm text-muted-foreground">{enrolledStudents.length} de {classItem.capacity} vagas.</p>
              </div>
            </div>
            {enrolledStudents.length === 0 ? (
              <p className="border-y py-6 text-sm text-muted-foreground">Ainda não há estudantes inscritos.</p>
            ) : (
              <ul className="divide-y border-y">
                {enrolledStudents.map((student) => (
                  <li key={student.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span><span className="block font-medium">{student.name}</span><span className="text-sm text-muted-foreground">{student.email}</span></span>
                    <Button type="button" variant="outline" size="sm" disabled={isSaving} onClick={() => void removeEnrollment(student.id)}>Remover inscrição</Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Registo de presenças</h2>
              <p className="mt-1 text-sm text-muted-foreground">Seleciona o estado de cada estudante para a data indicada.</p>
            </div>
            <label className="grid gap-1 text-sm font-medium">Data<Input type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} /></label>
          </section>
          {attendance.length === 0 ? (
            <p className="border-y py-6 text-sm text-muted-foreground">Não há estudantes inscritos para registar.</p>
          ) : (
            <ul className="divide-y border-y">
              {attendance.map((entry) => (
                <li key={entry.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span><span className="block font-medium">{entry.name}</span><span className="text-sm text-muted-foreground">{entry.email}</span></span>
                  <span className="flex flex-col gap-2 sm:flex-row">
                    <Select value={entry.status ?? "present"} onValueChange={(status: AttendanceStatus) => setAttendance((current) => current.map((item) => item.id === entry.id ? { ...item, status } : item))}>
                      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([status, label]) => <SelectItem key={status} value={status}>{label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input value={entry.note ?? ""} onChange={(event) => setAttendance((current) => current.map((item) => item.id === entry.id ? { ...item, note: event.target.value } : item))} placeholder="Nota (opcional)" className="sm:w-56" />
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Button type="button" disabled={isSaving || attendance.length === 0} onClick={() => void saveAttendance()}>Guardar presenças</Button>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <section className="max-w-3xl">
            <h2 className="text-lg font-semibold">Lançar nota</h2>
            <p className="mt-1 text-sm text-muted-foreground">Uma nova nota com o mesmo nome para o estudante atualiza o registo existente.</p>
            <form onSubmit={saveGrade} className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">Avaliação<Input required maxLength={255} value={assessmentName} onChange={(event) => setAssessmentName(event.target.value)} placeholder="Ex.: Teste 1" /></label>
              <label className="grid gap-1 text-sm font-medium">Estudante
                <Select value={gradeStudentId} onValueChange={setGradeStudentId}>
                  <SelectTrigger><SelectValue placeholder="Selecionar estudante" /></SelectTrigger>
                  <SelectContent>{enrolledStudents.map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectContent>
                </Select>
              </label>
              <label className="grid gap-1 text-sm font-medium">Nota obtida<Input required type="number" min="0" step="0.1" value={score} onChange={(event) => setScore(event.target.value)} /></label>
              <label className="grid gap-1 text-sm font-medium">Nota máxima<Input required type="number" min="0.1" step="0.1" value={maxScore} onChange={(event) => setMaxScore(event.target.value)} /></label>
              <label className="grid gap-1 text-sm font-medium">Data<Input required type="date" value={assessmentDate} onChange={(event) => setAssessmentDate(event.target.value)} /></label>
              <label className="grid gap-1 text-sm font-medium sm:col-span-2">Feedback<Textarea maxLength={2000} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Observações para o estudante" /></label>
              <div><Button type="submit" disabled={isSaving || !gradeStudentId}>{isSaving ? "A guardar..." : "Guardar nota"}</Button></div>
            </form>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Notas lançadas</h2>
            {grades.length === 0 ? (
              <p className="mt-3 border-y py-6 text-sm text-muted-foreground">Ainda não há notas nesta turma.</p>
            ) : (
              <ul className="mt-3 divide-y border-y">
                {grades.map((grade) => (
                  <li key={grade.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span><span className="block font-medium">{grade.assessmentName} · {grade.student.name}</span><span className="text-sm text-muted-foreground">{grade.assessmentDate}{grade.feedback ? ` · ${grade.feedback}` : ""}</span></span>
                    <Badge variant="outline">{grade.score} / {grade.maxScore}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default TeacherClassManage;
