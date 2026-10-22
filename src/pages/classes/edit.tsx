import { useBack, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import UploadWidget from "@/components/upload-widget";
import { classSchema } from "@/lib/facultySchema";
import type { Subject, UploadWidgetValue, User } from "@/types";

const ClassesEdit = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: { resource: "classes", action: "edit" },
  });
  const { refineCore: { onFinish }, handleSubmit, control, formState: { isSubmitting }, watch, setValue, formState } = form;
  const subjectsQuery = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  }).query;
  const teachersQuery = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  }).query;

  const bannerPublicId = watch("bannerCldPubId");
  const setBanner = (file: UploadWidgetValue | null, onChange: (value: string) => void) => {
    onChange(file?.url ?? "");
    setValue("bannerCldPubId", file?.publicId ?? "", { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    await onFinish(values);
  };

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <Breadcrumb />
      <header className="flex items-center gap-3 border-b pb-5">
        <Button type="button" variant="ghost" size="icon" onClick={() => back()} aria-label="Back to classes">
          <ArrowLeft aria-hidden="true" />
        </Button>
        <div>
          <h1 className="page-title">Editar turma</h1>
          <p className="mt-1 text-sm text-muted-foreground">Atualize as informações da turma.</p>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={control} name="bannerUrl" render={({ field }) => (
            <FormItem>
              <FormLabel>Imagem de capa</FormLabel>
              <FormControl>
                <UploadWidget
                  value={field.value ? { url: field.value, publicId: bannerPublicId ?? "" } : undefined}
                  onChange={(file) => setBanner(file, field.onChange)}
                />
              </FormControl>
              <FormMessage />
              {formState.errors.bannerCldPubId && !formState.errors.bannerUrl ? (
                <p className="text-sm text-destructive">{formState.errors.bannerCldPubId.message}</p>
              ) : null}
            </FormItem>
          )} />
          <FormField control={control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da turma</FormLabel>
              <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField control={control} name="subjectId" render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina</FormLabel>
                <Select value={field.value ? String(field.value) : undefined} onValueChange={(value) => field.onChange(Number(value))} disabled={subjectsQuery.isLoading}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione uma disciplina" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {(subjectsQuery.data?.data ?? []).map((subject) => (
                      <SelectItem key={subject.id} value={String(subject.id)}>{subject.name} ({subject.code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="teacherId" render={({ field }) => (
              <FormItem>
                <FormLabel>Docente</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={teachersQuery.isLoading}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione um docente" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {(teachersQuery.data?.data ?? []).map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField control={control} name="capacity" render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} value={field.value ?? ""} onChange={(event) => field.onChange(event.target.value === "" ? undefined : Number(event.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                    <SelectItem value="archived">Arquivada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Textarea {...field} value={field.value ?? ""} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isSubmitting || subjectsQuery.isError || teachersQuery.isError}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Guardar alterações
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default ClassesEdit;