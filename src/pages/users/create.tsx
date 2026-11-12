import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const userSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório."),
  email: z.string().trim().email("Introduza um e-mail válido."),
  password: z.string().min(8, "A palavra-passe deve ter pelo menos 8 caracteres.").max(128),
  role: z.enum(["student", "teacher", "admin"]),
});

const UsersCreate = () => {
  const back = useBack();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "student" },
    refineCoreProps: { resource: "users", action: "create" },
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
    <CreateView>
      <Breadcrumb />
      <h1 className="page-title">Adicionar utilizador</h1>
      <div className="intro-row">
        <p>Crie uma conta e escolha o papel inicial.</p>
        <Button type="button" variant="outline" onClick={() => back()}>Voltar</Button>
      </div>
      <Separator className="my-4" />
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField control={control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input autoComplete="name" placeholder="Nome completo" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl><Input type="email" autoComplete="email" placeholder="nome@exemplo.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Palavra-passe inicial</FormLabel>
                <FormControl><Input type="password" autoComplete="new-password" {...field} /></FormControl>
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
              {isSubmitting ? <><Loader2 className="animate-spin" />A criar...</> : "Criar utilizador"}
            </Button>
          </form>
        </Form>
      </div>
    </CreateView>
  );
};

export default UsersCreate;
