import { User } from "@/types/user";
import UserActions from "@/components/admin/user/UserActions";

type UserTableProps = {
    users: User[];
};

export default function UserTable({ users }: UserTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="px-4 py-3 font-medium">User</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Created</th>
                        <th className="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className="border-b border-border last:border-0"
                        >
                            <td className="px-4 py-4">
                                <div>
                                    <p className="font-medium">
                                        {user.displayName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        @{user.username}
                                    </p>
                                </div>
                            </td>

                            <td className="px-4 py-4 text-muted-foreground">
                                {user.email}
                            </td>

                            <td className="px-4 py-4">
                                <RoleBadge role={user.role} />
                            </td>

                            <td className="px-4 py-4">
                                <StatusBadge status={user.status} />
                            </td>

                            <td className="px-4 py-4 text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>

                            <td className="px-4 py-4 text-right">
                                <UserActions user={user} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function RoleBadge({ role }: { role: User["role"] }) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {role}
        </span>
    );
}

function StatusBadge({ status }: { status: User["status"] }) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {status}
        </span>
    );
}