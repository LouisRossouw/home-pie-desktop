import { Link } from 'react-router'

export function NoMatch() {
  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center bg-background">
      <div>
        <h2>Nothing to see here!</h2>
        <p>
          <Link to="/">Go to the home page</Link>
        </p>
      </div>
    </div>
  )
}
