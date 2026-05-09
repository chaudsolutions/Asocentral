import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import ArticleIcon from "@mui/icons-material/Article";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
import { useUserDashboard, useUserData } from "~/hooks/useCaching";

export function meta() {
    return [{ title: "Journalist Dashboard | N/A" }];
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
            <Box sx={{ height: 280 }}>
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

const shortTitle = (title: string) =>
    title.length > 26 ? `${title.slice(0, 26)}...` : title;

export default function UserDashboard() {
    const { userData, isUserDataLoading } = useUserData();
    const { userDashboard, isUserDashboardLoading } = useUserDashboard();

    if (isUserDataLoading || isUserDashboardLoading) {
        return <LinearProgress />;
    }

    const published = userDashboard?.stats.publishedNews || 0;
    const pending = userDashboard?.stats.unpublishedNews || 0;

    const kyc = userData?.kycDetails;
    const kycFields = [
        kyc?.firstName,
        kyc?.lastName,
        kyc?.address,
        kyc?.state,
        kyc?.country,
        kyc?.occupation,
        kyc?.age,
        kyc?.idCardImage,
    ];
    const completedKycFields = kycFields.filter(Boolean).length;
    const kycProgress = Math.round(
        (completedKycFields / kycFields.length) * 100,
    );

    const downloaded =
        userDashboard?.charts.topDownloadedNews.map((news) => ({
            name: shortTitle(news.title),
            downloads: news.downloads || 0,
        })) || [];
    const shared =
        userDashboard?.charts.topSharedNews.map((news) => ({
            name: shortTitle(news.title),
            shares: news.shares || 0,
        })) || [];
    const viewed =
        userDashboard?.charts.topViewedNews.map((news) => ({
            name: shortTitle(news.title),
            views: news.views || 0,
        })) || [];
    const commented =
        userDashboard?.charts.topCommentedNews.map((news) => ({
            name: shortTitle(news.title),
            comments: news.commentsCount || 0,
        })) || [];
    const publishedPie = [
        { name: "Published", value: published },
        { name: "Unpublished", value: pending },
    ];

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    Welcome, {userData?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Track submission progress, review performance, and keep
                    your verification ready for publishing.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 2,
                }}>
                <StatCard
                    label="Total Submissions"
                    value={published + pending}
                    icon={<ArticleIcon fontSize="large" />}
                />
                <StatCard
                    label="Pending Review"
                    value={pending}
                    icon={<PendingActionsIcon fontSize="large" />}
                />
                <StatCard
                    label="Posted"
                    value={published}
                    icon={<CheckCircleIcon fontSize="large" />}
                />
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                        <Typography variant="body2" color="text.secondary">
                            KYC Progress
                        </Typography>
                        <AssignmentTurnedInIcon sx={{ color: "#003366" }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {kycProgress}%
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={kycProgress}
                        sx={{ mt: 1, height: 8, borderRadius: 1 }}
                    />
                    <Chip
                        label={userData?.kycStatus ? "Complete" : "Pending"}
                        color={userData?.kycStatus ? "success" : "warning"}
                        size="small"
                        sx={{ mt: 1 }}
                    />
                </Paper>
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
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #eee" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                        Published vs Unpublished News
                    </Typography>
                    <Box sx={{ height: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={publishedPie}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={90}
                                    label>
                                    {publishedPie.map((entry, index) => (
                                        <Cell
                                            key={entry.name}
                                            fill={
                                                ["#003366", "#c00"][
                                                    index % 2
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
