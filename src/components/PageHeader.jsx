import Breadcrumb from './Breadcrumb.jsx'

export default function PageHeader({ title, breadcrumb }) {
  return (
    <header className="mb-4 space-y-1 text-left">
      {breadcrumb && <Breadcrumb {...breadcrumb} />}
      <h1 className="text-heading font-bold font-headline">{title}</h1>
    </header>
  )
}
