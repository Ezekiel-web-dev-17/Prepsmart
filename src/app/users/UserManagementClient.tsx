"use client";

import { useState } from "react";
import { useUsersQuery, useCreateUserMutation } from "@/hooks/useUsers";

export default function UserManagementClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // TanStack Query: Fetching data with automatic cache & background refresh
  const { data: users, isLoading, isError, error, isFetching } = useUsersQuery();

  // TanStack Query: Mutating data & automatic cache invalidation
  const createUserMutation = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Email is required");
      return;
    }

    try {
      await createUserMutation.mutateAsync({ name: name || undefined, email });
      setName("");
      setEmail("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by TanStack Query (React Query) + Zod + Prisma
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
              Syncing...
            </span>
          )}
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            TanStack Cache Active
          </span>
        </div>
      </div>

      {/* Add User Form (useMutation) */}
      <form onSubmit={handleSubmit} className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Add New User (TanStack useMutation)
        </h3>
        
        {formError && (
          <div className="p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="user-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Name (optional)
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marie Curie"
              className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="user-email" className="block text-xs font-semibold text-slate-600 mb-1">
              Email (required)
            </label>
            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. marie@curie.edu"
              required
              className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={createUserMutation.isPending}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          {createUserMutation.isPending ? "Adding user..." : "Create User"}
        </button>
      </form>

      {/* Users List (useQuery) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Users in Cache ({users?.length ?? 0})
        </h3>

        {isLoading ? (
          <div className="space-y-2 py-4">
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        ) : isError ? (
          <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            Error: {error instanceof Error ? error.message : "Failed to load users"}
          </div>
        ) : users && users.length > 0 ? (
          <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {users.map((user) => (
              <li
                key={user.id}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {user.id.slice(0, 10)}...
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 py-4 text-center">
            No users yet. Add one above to test TanStack Query cache!
          </p>
        )}
      </div>
    </div>
  );
}
