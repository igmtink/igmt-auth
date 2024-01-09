import { cn } from '@/lib/utils'

export const Card: React.FC<TCard> = ({
  children,
  title,
  description,
  className
}) => {
  return (
    <div className={cn('w-full rounded-md bg-card p-6 shadow-md', className)}>
      {title && <h2 className='mb-1.5 text-xl font-bold'>{title}</h2>}
      {description && <h3 className='text-muted-foreground'>{description}</h3>}

      <div className='mt-8 flex flex-col gap-4'>{children}</div>
    </div>
  )
}
