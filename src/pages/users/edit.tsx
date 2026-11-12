import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const userSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  email: z.string().trim().email("Introduza um e-mail válido."),
  role: z.enum(["student", "teacher", "admin"]),
});

const UsersEdit = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(userSchema),
    refineCoreProps: { resource: "users", action: "edit" },
  });
  const {
    refineCore: { onFinish },
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    await onFinish(values);
  };

  return (
    <EditView>
      <Breadcrumb />
      <h1 className="page-title">Editar utilizador</h1>
      <div className="intro-row">
        <p>Atualize os dados e o papel da conta.</p>
        <Button type="button" variant="outline" onClick={() => back()}>Voltar</Button>
      </div>
      <Separator className="my-4" />
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input autoComplete="name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Papel</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Escolha um papel" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <Separator />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="animate-spin" />A guardar...</> : "Guardar alterações"}
            </Button>
          </form>
        </Form>
      </div>
    </EditView>
  );
};

export default UsersEdit;
