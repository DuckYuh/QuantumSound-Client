export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your QuantumSound platform.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard title="Users" value="0" />
                <DashboardCard title="Tracks" value="0" />
                <DashboardCard title="Albums" value="0" />
                <DashboardCard title="Reports" value="0" />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-xl border border-border bg-surface p-5">
                    <h2 className="font-semibold">Recent Users</h2>
                    <div className="mt-4 text-sm text-muted-foreground">
                        No data yet.
                    </div>
                </section>

                <section className="rounded-xl border border-border bg-surface p-5">
                    <h2 className="font-semibold">Recent Tracks</h2>
                    <div className="mt-4 text-sm text-muted-foreground">
                        No data yet.
                    </div>
                </section>
            </div>
        </div>
    );
}

function DashboardCard({title,value}: {title: string;value: string;}) {
    return (
        <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
    );
}