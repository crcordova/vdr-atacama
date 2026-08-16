"use client";

type PasswordInputProps = {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  autoComplete?: string;
  error?: string | null;
  describedBy?: string;
};

export function PasswordInput({
  id,
  label,
  name,
  required = false,
  autoComplete,
  error,
  describedBy,
}: PasswordInputProps) {
  const describedByValue =
    [describedBy, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-cream">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="password"
        required={required}
        autoComplete={autoComplete ?? "current-password"}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByValue}
        className="w-full bg-sky-700 text-cream placeholder:text-sky-300/60 border border-sky-300/20 rounded-md px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900 aria-[invalid=true]:border-desert-500"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-desert-300">
          {error}
        </p>
      )}
    </div>
  );
}

export type { PasswordInputProps };
