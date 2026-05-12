import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";

import userApi from "../../api/user/user-apis";
import { authActions } from "../../store/slices/auth/slice";

const AdminUsers = () => {
  const dispatch = useDispatch();

  const { users, userPagination } = useSelector((state) => state.auth);

  const { page, totalPages, limit } = userPagination;

  const fetchNextPage = () => {
    if (page < totalPages) {
      dispatch(
        authActions.setUserPagination({
          page: page + 1,
        }),
      );
    }
  };

  useEffect(() => {
    userApi.getUsers({
      page,
      limit,
    });
  }, [page, limit]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          People
        </p>

        <h1 className="font-display text-4xl">Users</h1>
      </div>

      <div
        id="scrollableUsersContainer"
        className="bg-card border border-border rounded-2xl overflow-auto h-[70vh] relative"
      >
        <InfiniteScroll
          dataLength={users.length}
          next={fetchNextPage}
          hasMore={page < totalPages}
          scrollableTarget="scrollableUsersContainer"
          loader={
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
          endMessage={
            <p className="text-center p-6 text-xs text-muted-foreground">
              End of users ({users.length} users)
            </p>
          }
        >
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-20 shadow-sm text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-4">Name</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Role</th>

                <th className="text-left p-4 hidden md:table-cell">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users?.map((u) => (
                <tr
                  key={u?._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-warm text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {u?.name
                          ?.split(" ")
                          ?.map((n) => n[0])
                          ?.join("")}
                      </div>

                      {u?.name}
                    </div>
                  </td>

                  <td className="p-4 text-muted-foreground">{u?.email}</td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full capitalize ${
                        u?.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {u?.role}
                    </span>
                  </td>

                  <td className="p-4 hidden md:table-cell text-muted-foreground">
                    {new Date(u?.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AdminUsers;
