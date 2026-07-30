import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "overflow-hidden rounded-full bg-primary text-white flex items-center justify-center font-semibold shrink-0",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-lg",
        sp: "h-36 w-36 text-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends VariantProps<typeof avatarVariants> {
  name?: string;
  avatar?: string | null;
  className?: string;
}

export function Avatar({ 
  name, 
  avatar, 
  size, 
  className, 
}: AvatarProps) {
  const letter = name?.charAt(0).toUpperCase() ?? "?";

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={name ?? "Avatar"}
        width={64}
        height={64}
        className={cn(
          avatarVariants({ size }),
          "object-cover",
          className
        )}
      />
    );
  }

  return (
    <div className={cn(avatarVariants({ size }), className)}>
      {letter}
    </div>
  );
}