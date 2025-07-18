import Card from './Card.jsx'

export default function Panel({ className = '', children, ...props }) {
  return (
    <Card className={className} {...props}>
      {children}
    </Card>
  )
}
