import { ModeToggle } from "@/components/theme-toggle";
import VideoSection from "@/components/video-section";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const { userId, organization, orgId, orgRole } = auth();

  console.log("orgId: ", orgId);
  console.log("orgRole: ", orgRole);

  if (userId) {
    // Query DB for user specific information or display assets only to logged in users
    // console.log("currentUser: ", userId);
  }

  const user = await currentUser();
  // console.log("user: ", user);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 p-24">
      <UserButton afterSignOutUrl="/" />
      <div className="z-10 max-w-5xl w-full items-center text-sm flex">
        <ModeToggle />
        <p className="pl-4 font-bold text-2xl">Clip Editor Testing</p>
      </div>
      <VideoSection />
    </main>
  );
}
