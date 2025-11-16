import { getSchools } from "@/lib/cms/repositories/schools";
import SchoolPicker from "./school-picker";


export default async function MenuPage() {
  const schools = await getSchools();

  if (!schools || schools.length === 0) {
    return (
      <div className="mx-auto p-6 md:p-10">
        <p className="text-center text-muted-foreground">
          No schools found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 md:p-10">
      <SchoolPicker schools={schools} />
    </div>
  );
}
