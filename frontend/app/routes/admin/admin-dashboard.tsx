import { appName } from "~/utils/constants";

export function meta() {
    return [{ title: `Admin Dashboard | ${appName}` }];
}

export default function AdminDashboard() {
    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
}
