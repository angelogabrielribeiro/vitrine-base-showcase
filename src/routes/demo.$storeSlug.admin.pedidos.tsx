import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/$storeSlug/admin/pedidos")({
  component: OrdersLayout,
});

function OrdersLayout() {
  return <Outlet />;
}
