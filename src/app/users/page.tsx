import { prisma } from '@/lib/prisma';
import type { User, UserListItem } from '@/lib/validations/user';
import UserManagementClient from './UserManagementClient';

export const instant = false;

export default async function UsersPage() {
    // Direct database query on the server (Server Component pattern)
    const users: User[] = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-8 py-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Users & TanStack Query Demo</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Comparing direct Server Component database fetching with client-side TanStack Query cache.
                </p>
            </div>

            {/* Interactive TanStack Query UI */}
            <UserManagementClient />

            {/* Server-Rendered Snapshot */}
            <div className="max-w-2xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                    Initial Server-Rendered Snapshot (Direct Prisma)
                </h2>
                <ul className="divide-y divide-slate-200 text-sm">
                    {users.map((user: UserListItem) => (
                        <li key={user.id} className="py-2 flex justify-between text-slate-700">
                            <span>{user.name ?? "Anonymous"}</span>
                            <span className="text-xs text-slate-400">{user.email}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}