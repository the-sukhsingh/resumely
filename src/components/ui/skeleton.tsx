import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/60",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-linear-to-r after:from-transparent after:via-foreground/6 dark:after:via-foreground/8 after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
