import { forwardRef } from "react";

type ButtonVariant = "primary" | "ghost";

type BaseButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
};

type ButtonAsButton = BaseButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type ButtonAsAnchor = BaseButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function buttonClasses(
  variant: ButtonVariant,
  fullWidth: boolean,
  className?: string
) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium px-6 py-3 rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-900 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
  const variantClasses =
    variant === "primary"
      ? "bg-gold-700 text-cream hover:bg-gold-500"
      : "bg-transparent text-cream border border-cream/40 hover:bg-cream/10";

  return [baseClasses, variantClasses, fullWidth ? "w-full" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      fullWidth = false,
      className,
      as,
      ...rest
    },
    ref
  ) => {
    const classes = buttonClasses(variant, fullWidth, className);

    if (as === "a") {
      const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        className={classes}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
