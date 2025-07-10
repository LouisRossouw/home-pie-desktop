export default function DebugRoute() {
  // TODO; Only allow if user isStaff & isAdmin

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <div className="grid w-full p-4 border rounded-lg gap-4">
        <h2>Debug section</h2>
      </div>
    </div>
  )
}
