interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-[#F5E6D3] animate-pulse rounded-full ${className}`} />
  );
}
