import { Link } from 'react-router-dom'
import PageContainer from "../components/PageContainer.jsx"

export default function NotFound() {
  return (
    <PageContainer className="text-center space-y-4">
      <h1 className="text-heading font-bold font-headline">Page Not Found</h1>
      <p className="text-gray-600">Sorry, we couldn\'t find that page.</p>
      <Link to="/" className="text-green-600 underline">
        Go to Today
      </Link>
    </PageContainer>
  )
}
