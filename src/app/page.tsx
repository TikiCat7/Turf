import { ModeToggle } from "@/components/theme-toggle";
import VideoSection from "@/components/video-section";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId, orgId, orgRole } = auth();

  console.log("orgId: ", orgId);
  console.log("orgRole: ", orgRole);
  console.log("--- clerk userID ---", userId);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 p-24">
      <UserButton afterSignOutUrl="/" />
      <OrganizationSwitcher />
      <div className="z-10 max-w-5xl w-full items-center text-sm flex">
        <ModeToggle />
        <p className="pl-4 font-bold text-2xl">Clip Editor Testing</p>
      </div>
      <VideoSection />
    </main>
  );
}
