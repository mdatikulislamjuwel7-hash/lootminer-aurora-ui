import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { mockSurveys } from "@/data/mock";
import { ProviderAdminTable } from "./_admin.admin.offerwalls";

export const Route = createFileRoute("/_admin/admin/surveys")({
  head: () => ({ meta: [{ title: "Admin · Surveys" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin" title="Survey Partners" />
      <ProviderAdminTable title="Surveys" items={mockSurveys} />
    </div>
  ),
});
