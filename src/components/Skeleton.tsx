interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-[#F5E6D3] dark:bg-dark-border animate-pulse rounded-full ${className}`} />
  );
}
