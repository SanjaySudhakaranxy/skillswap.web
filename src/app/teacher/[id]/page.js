import TeacherClient from "./TeacherClient";

export const dynamic = "force-dynamic";

export default function TeacherPage({ params }) {
  return <TeacherClient teacherId={params.id} />;
}
