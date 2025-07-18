import Card from './Card.jsx'

export default function SectionCard({ className = '', children, ...props }) {
  return (
    <Card as="section" className={className} {...props}>
      {children}
    </Card>
  )
}
