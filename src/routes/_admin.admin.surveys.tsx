import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/surveys")({
  beforeLoad: () => { throw redirect({ to: "/admin/offerwalls" }); },
  component: () => null,
});
