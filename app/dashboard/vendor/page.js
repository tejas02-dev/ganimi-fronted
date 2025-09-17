export default function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Manage your services, bookings, and track your business performance.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">My Services</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Bookings</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Completed Orders</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Monthly Earnings</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">₹12,450</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No recent bookings to display</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analytics coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}
