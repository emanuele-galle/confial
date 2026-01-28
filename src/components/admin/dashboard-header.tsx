export function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Dashboard Amministrativa
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {new Date().toLocaleDateString("it-IT", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </span>
      </div>
    </header>
  );
}
