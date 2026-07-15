import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getStore } from "@/config/stores";
import { repo } from "@/services/local-repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, Lock } from "lucide-react";

export const Route = createFileRoute("/demo/$storeSlug/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { storeSlug } = Route.useParams();
  const store = getStore(storeSlug)!;
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const enter = () => {
    repo.setSession({
      kind: "admin",
      storeSlug,
      label: user || "Administrador demo",
      createdAt: new Date().toISOString(),
      demo: true,
    });
    navigate({ to: "/demo/$storeSlug/admin", params: { storeSlug } });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-sm rounded-[var(--radius)] border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Painel administrativo</div>
            <div className="font-display text-lg font-semibold">{store.name}</div>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>Acesso demonstrativo — autenticação segura será conectada na versão do cliente.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enter();
          }}
          className="space-y-3"
        >
          <div>
            <Label htmlFor="u">Usuário</Label>
            <Input id="u" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" />
          </div>
          <div>
            <Label htmlFor="p">Senha</Label>
            <Input id="p" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">Entrar no painel demonstrativo</Button>
        </form>

        <div className="mt-6 text-center text-xs">
          <Link to="/demo/$storeSlug" params={{ storeSlug }} className="text-muted-foreground hover:underline">
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  );
}
