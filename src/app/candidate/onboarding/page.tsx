import OnboardingWizard from "./Wizard";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Build your profile</h1>
      <p className="mt-1 text-sm text-slate-600">
        Paste your CV below. Our AI reads it and only asks for what&apos;s missing — under 3 minutes.
      </p>
      <div className="mt-6">
        <OnboardingWizard />
      </div>
    </div>
  );
}
