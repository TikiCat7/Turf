import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className="pb-4">
          <ModeToggle />
        </div>
        <p className="font-bold text-2xl">Clip Editor Testing</p>
      </div>
    </main>
  );
}
