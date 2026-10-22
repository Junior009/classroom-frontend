import { useBack } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { departmentSchema } from "@/lib/facultySchema";

const DepartmentsEdit = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: { resource: "departments", action: "edit" },
  });
  const { refineCore: { onFinish }, handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
    await onFinish(values);
  };

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6">
      <Breadcrumb />
      <header className="flex items-center gap-3 border-b pb-5">
        <Button type="button" variant="ghost" size="icon" onClick={() => back()} aria-label="Back to departments">
          <ArrowLeft aria-hidden="true" />
        </Button>
        <div>
          <h1 className="page-title">Editar departamento</h1>
          <p className="mt-1 text-sm text-muted-foreground">Atualize os dados do departamento.</p>
        </div>
      </header>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Guardar alterações
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default DepartmentsEdit;