import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { getStore } from "@/config/stores";
import { repo } from "@/services/local-repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/demo/$storeSlug/login")({
  component: LoginPage,
});

function LoginPage() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");

  const enter = (label: string) => {
    repo.setSession({
      kind: "customer",
      storeSlug,
      label,
      createdAt: new Date().toISOString(),
      demo: true,
    });
    navigate({ to: "/demo/$storeSlug", params: { storeSlug } });
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{store.name}</p>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>Sessão demonstrativa. Nenhuma credencial é validada; a autenticação real será conectada na versão do cliente.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enter(identifier || "Convidado demo");
        }}
        className="mt-6 space-y-3"
      >
        <div>
          <Label htmlFor="id">WhatsApp ou e-mail</Label>
          <Input id="id" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="seu contato" />
        </div>
        <div>
          <Label htmlFor="pw">Senha</Label>
          <Input id="pw" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full">{mode === "login" ? "Entrar" : "Criar conta e entrar"}</Button>
      </form>

      <div className="mt-4 flex justify-between text-sm">
        <button className="text-primary hover:underline" onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}>
          {mode === "login" ? "Criar conta" : "Já tenho conta"}
        </button>
        <button className="text-muted-foreground hover:underline" onClick={() => enter("Convidado")}>
          Continuar sem conta
        </button>
      </div>

      <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <Link to="/demo/$storeSlug/admin/login" params={{ storeSlug }} className="hover:underline">
          Acesso administrativo
        </Link>
      </div>
    </div>
  );
}
