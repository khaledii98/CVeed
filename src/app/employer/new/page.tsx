import RecruiterWizard from "./Wizard";

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">New hiring request</h1>
      <p className="mt-1 text-sm text-slate-600">
        Describe who you need in plain language. The AI Recruiter turns it into a structured brief.
      </p>
      <div className="mt-6">
        <RecruiterWizard />
      </div>
    </div>
  );
}
