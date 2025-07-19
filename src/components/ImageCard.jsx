import Card from './Card.jsx'

export default function ImageCard({
  as: Component = 'div',
  imgSrc,
  title,
  badges,
  children,
  className = '',
  ...props
}) {
  return (
    <Card as={Component} className={`p-0 overflow-hidden relative ${className}`} {...props}>
      <div className="relative">
        <img src={imgSrc} alt={typeof title === 'string' ? title : ''} loading="lazy" className="plant-thumb" />
        <div className="img-gradient-overlay" aria-hidden="true"></div>
        {(title || badges) && (
          <div className="absolute bottom-1 left-2 right-2 drop-shadow text-white space-y-0.5">
            {title && (
              <div className="font-bold text-lg font-headline leading-none">{title}</div>
            )}
            {badges && <div className="flex flex-wrap gap-1">{badges}</div>}
          </div>
        )}
      </div>
      {children && <div className="p-4">{children}</div>}
    </Card>
  )
}
