import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "yesinline-flex yesitems-center yesjustify-center yeswhitespace-nowrap yesrounded-md yestext-sm yesfont-medium yesring-offset-white yestransition-colors focus-visible:yesoutline-none focus-visible:yesring-2 focus-visible:yesring-slate-950 focus-visible:yesring-offset-2 disabled:yespointer-events-none disabled:yesopacity-50 dark:yesring-offset-slate-950 dark:focus-visible:yesring-slate-300",
  {
    variants: {
      variant: {
        default: "yesbg-slate-900 yestext-slate-50 hover:yesbg-slate-900/90 dark:yesbg-slate-50 dark:yestext-slate-900 dark:hover:yesbg-slate-50/90",
        destructive:
          "yesbg-red-500 yestext-slate-50 hover:yesbg-red-500/90 dark:yesbg-red-900 dark:yestext-slate-50 dark:hover:yesbg-red-900/90",
        outline:
          "yesborder yesborder-slate-200 yesbg-white hover:yesbg-slate-100 hover:yestext-slate-900 dark:yesborder-slate-800 dark:yesbg-slate-950 dark:hover:yesbg-slate-800 dark:hover:yestext-slate-50",
        secondary:
          "yesbg-slate-100 yestext-slate-900 hover:yesbg-slate-100/80 dark:yesbg-slate-800 dark:yestext-slate-50 dark:hover:yesbg-slate-800/80",
        ghost: "hover:yesbg-slate-100 hover:yestext-slate-900 dark:hover:yesbg-slate-800 dark:hover:yestext-slate-50",
        link: "yestext-slate-900 yesunderline-offset-4 hover:yesunderline dark:yestext-slate-50",
      },
      size: {
        default: "yesh-10 yespx-4 yespy-2",
        sm: "yesh-9 yesrounded-md yespx-3",
        lg: "yesh-11 yesrounded-md yespx-8",
        icon: "yesh-10 yesw-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
