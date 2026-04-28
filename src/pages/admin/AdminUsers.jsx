import { seedUsers } from "@/data/seed";

const AdminUsers = () => (
  <div className="space-y-6">
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">People</p>
      <h1 className="font-display text-4xl">Users</h1>
    </div>
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Role</th>
            <th className="text-left p-4 hidden md:table-cell">Joined</th>
          </tr>
        </thead>
        <tbody>
          {seedUsers.map((u) => (
            <tr key={u.id} className="border-t border-border">
              <td className="p-4 font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-warm text-primary-foreground flex items-center justify-center text-xs font-medium">
                    {u.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {u.name}
                </div>
              </td>
              <td className="p-4 text-muted-foreground">{u.email}</td>
              <td className="p-4">
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>
                  {u.role}
                </span>
              </td>
              <td className="p-4 hidden md:table-cell text-muted-foreground">{u.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminUsers;
