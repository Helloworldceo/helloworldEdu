import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CertificateView from "./CertificateView";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
  });

  if (!course) notFound();

  const certificate = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });

  if (!certificate) notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return (
    <CertificateView
      studentName={user?.name || "Student"}
      courseTitle={course.title}
      issuedAt={certificate.issuedAt.toISOString()}
      certificateId={certificate.id}
    />
  );
}
