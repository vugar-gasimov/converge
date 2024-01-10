import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "yesflex yesh-10 yesw-full yesrounded-md yesborder yesborder-slate-200 yesbg-white yespx-3 yespy-2 yestext-sm yesring-offset-white file:yesborder-0 file:yesbg-transparent file:yestext-sm file:yesfont-medium placeholder:yestext-slate-500 focus-visible:yesoutline-none focus-visible:yesring-2 focus-visible:yesring-slate-950 focus-visible:yesring-offset-2 disabled:yescursor-not-allowed disabled:yesopacity-50 dark:yesborder-slate-800 dark:yesbg-slate-950 dark:yesring-offset-slate-950 dark:placeholder:yestext-slate-400 dark:focus-visible:yesring-slate-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
