import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArticleIcon from "@mui/icons-material/Article";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BarChartIcon from "@mui/icons-material/BarChart";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useAdminDashboard } from "~/hooks/useCaching";

export function meta() {
    return [{ title: "Admin Dashboard | N/A" }];
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}>
                <Box>
                    <Typography variant="body2" color="text.secondary">
                        {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {value}
                    </Typography>
                </Box>
                <Box sx={{ color: "#003366" }}>{icon}</Box>
            </Box>
        </Paper>
    );
}

function DashboardChart({
    title,
    data,
    dataKey,
}: {
    title: string;
    data: Record<string, string | number>[];
    dataKey: string;
}) {
    return (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            height={70}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar
                            dataKey={dataKey}
                            fill="#003366"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

function DashboardPieChart({
    title,
    data,
}: {
    title: string;
    data: { name: string; value: number }[];
}) {
    const colors = ["#003366", "#c00"];

    return (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                {title}
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label>
                            {data.map((entry, index) => (
                                <Cell
                                    key={entry.name}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

const shortTitle = (title: string) =>
    title.length > 26 ? `${title.slice(0, 26)}...` : title;

export default function AdminDashboard() {
    const { adminDashboard, isAdminDashboardLoading } = useAdminDashboard();

    if (isAdminDashboardLoading || !adminDashboard) {
        return <Skeleton variant="rectangular" height={600} />;
    }

    const { stats, charts } = adminDashboard;

    const downloaded = charts.topDownloadedNews.map((news) => ({
        name: shortTitle(news.title),
        downloads: news.downloads || 0,
    }));
    const shared = charts.topSharedNews.map((news) => ({
        name: shortTitle(news.title),
        shares: news.shares || 0,
    }));
    const viewed = charts.topViewedNews.map((news) => ({
        name: shortTitle(news.title),
        views: news.views || 0,
    }));
    const commented = charts.topCommentedNews.map((news) => ({
        name: shortTitle(news.title),
        comments: news.commentsCount || 0,
    }));
    const journalists = charts.topJournalists.map((user) => ({
        name: user.name,
        submissions: user.submissions,
        posted: user.posted,
    }));
    const publishedPie = [
        { name: "Published", value: stats.publishedNews },
        { name: "Unpublished", value: stats.unpublishedNews },
    ];
    const activePie = [
        { name: "Active", value: stats.activeNews },
        { name: "Inactive", value: stats.inactiveNews },
    ];

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    Admin Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor journalists, submissions, publishing activity, and
                    reader engagement.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(5, 1fr)",
                    },
                    gap: 2,
                }}>
                <StatCard
                    label="Users"
                    value={stats.totalUsers}
                    icon={<PeopleAltIcon fontSize="large" />}
                />
                <StatCard
                    label="Users With News"
                    value={stats.usersWithNews}
                    icon={<ArticleIcon fontSize="large" />}
                />
                <StatCard
                    label="Published News"
                    value={stats.publishedNews}
                    icon={<CheckCircleIcon fontSize="large" />}
                />
                <StatCard
                    label="Unpublished News"
                    value={stats.unpublishedNews}
                    icon={<PendingActionsIcon fontSize="large" />}
                />
                <StatCard
                    label="Active News"
                    value={stats.activeNews}
                    icon={<BarChartIcon fontSize="large" />}
                />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                    gap: 3,
                }}>
                <DashboardChart
                    title="Top 5 Most Downloaded News"
                    data={downloaded}
                    dataKey="downloads"
                />
                <DashboardChart
                    title="Top 5 Most Shared News"
                    data={shared}
                    dataKey="shares"
                />
                <DashboardChart
                    title="Top 5 Most Viewed News"
                    data={viewed}
                    dataKey="views"
                />
                <DashboardChart
                    title="Top 5 Most Commented News"
                    data={commented}
                    dataKey="comments"
                />
                <DashboardChart
                    title="Top Journalists"
                    data={journalists}
                    dataKey="submissions"
                />
                <DashboardPieChart
                    title="Published vs Unpublished News"
                    data={publishedPie}
                />
                <DashboardPieChart
                    title="Active vs Inactive Published News"
                    data={activePie}
                />
            </Box>
        </Box>
    );
}
