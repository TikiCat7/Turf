import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary/50 text-sm normal-case",
          },
        }}
      />
    </div>
  );
}
