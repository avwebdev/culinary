export default async function SchoolPage({
  params,
}: {
  params: { school: string[] };
}) {
  const school = (await params).school.join("/");
}
