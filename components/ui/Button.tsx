import { forwardRef } from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      type = "button",
      disabled = false,
      fullWidth = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium px-6 py-3 rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-desert-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
    const variantClasses =
      variant === "primary"
        ? "bg-desert-700 text-cream hover:bg-desert-500"
        : "bg-transparent text-cream border border-cream/40 hover:bg-cream/10";
    const classes = [
      baseClasses,
      variantClasses,
      fullWidth ? "w-full" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
