export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">
          Manage your bookings, orders, and discover new services.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Bookings</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 upcoming this week
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Completed Orders</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +4 this month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Spent</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">₹8,750</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Saved Amount</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">₹1,250</div>
            <p className="text-xs text-muted-foreground">
              From discounts
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Bookings</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <div>
                <p className="font-medium">Laundry Service</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <div>
                <p className="font-medium">Food Delivery</p>
                <p className="text-sm text-muted-foreground">Yesterday, 7:30 PM</p>
              </div>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Delivered</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
            <h4 className="font-medium">Browse Services</h4>
            <p className="text-sm text-muted-foreground">Discover new services</p>
          </button>
          <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
            <h4 className="font-medium">Book Service</h4>
            <p className="text-sm text-muted-foreground">Schedule a new booking</p>
          </button>
          <button className="p-4 text-left border rounded-lg hover:bg-muted transition-colors">
            <h4 className="font-medium">View History</h4>
            <p className="text-sm text-muted-foreground">Check past orders</p>
          </button>
        </div>
      </div>
    </div>
  )
}
