import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminRoute } from "@/lib/auth";

export const Route = createFileRoute("/_admin")({
  component: () => (
    <AdminRoute>
      <AppLayout admin />
    </AdminRoute>
  ),
});
