import { AdminStatePanel } from "@/components/admin-state-panel";
import { getAcademicCatalog } from "@/lib/api/services";

import { UploadManagerClient } from "./upload-manager-client";

export const dynamic = "force-dynamic";

export default async function UploadManagerPage() {
  try {
    const catalog = await getAcademicCatalog();
    return <UploadManagerClient initialCatalog={catalog} />;
  } catch {
    return (
      <AdminStatePanel
        tone="error"
        eyebrow="Catalog Offline"
        title="The lecture catalog could not be loaded."
        description="Departments, programs, and subjects are served by the backend. Check the backend connection and try again."
        primaryHref="/admin/upload"
        primaryLabel="Retry Upload Page"
        secondaryHref="/admin/processing"
        secondaryLabel="Open Processing Queue"
      />
    );
  }
}
