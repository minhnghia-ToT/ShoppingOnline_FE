"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const cardStyle = {
  background: "white",
  borderRadius: "14px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string;
}) {
  return (
    <div style={{ ...cardStyle, padding: "22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "#888", fontWeight: 600 }}>
            {title}
          </p>
          <h2
            style={{
              margin: "8px 0 4px",
              fontSize: 28,
              fontWeight: 800,
              color: "#1a2038",
            }}
          >
            {value}
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>{subtitle}</p>
        </div>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();

  const [chartData, setChartData] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [weeklyData, overviewData] = await Promise.all([
          api.getWeeklySales(),
          api.getDashboardOverview(),
        ]);

        // Prepare chart data
        const labels = weeklyData.map((item: any) => item.day);
        const quantities = weeklyData.map(
          (item: any) => item.totalQuantity
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Products Sold",
              data: quantities,
              borderColor: "#4f8cff",
              backgroundColor: "rgba(79,140,255,0.12)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "#4f8cff",
            },
          ],
        });

        setOverview(overviewData);
      } catch (err: any) {
        console.error(err);

        if (err.message?.includes("401")) {
          router.push("/login");
        } else {
          setError("Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#888" },
      },
      y: {
        grid: { color: "#f1f3f8" },
        ticks: { color: "#888" },
      },
    },
  };

  return (
    <div
      style={{
        padding: "24px 30px",
        background: "#f6f8fc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          Dashboard Overview
        </h1>

        <div
          onClick={() => router.push("/admin/account")}
          style={{
            cursor: "pointer",
            fontWeight: 600,
            color: "#4f8cff",
          }}
        >
          My Account
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <StatCard
          title="Total Products"
          value={overview ? overview.totalProducts : "--"}
          subtitle="Available in store"
          icon="📦"
          color="#e3f2fd"
        />

        <StatCard
          title="Products Sold"
          value={overview ? overview.productsSoldThisMonth : "--"}
          subtitle="This month"
          icon="🛒"
          color="#e8f5e9"
        />

        <StatCard
          title="Revenue"
          value={
            overview
              ? `$${overview.revenueLast30Days.toLocaleString()}`
              : "--"
          }
          subtitle="Last 30 days"
          icon="💰"
          color="#fff3e0"
        />

        <StatCard
          title="Active Customers"
          value={overview ? overview.activeCustomers : "--"}
          subtitle="Returning buyers"
          icon="👥"
          color="#f3e5f5"
        />
      </div>

      {/* Chart */}
      <div style={{ ...cardStyle, padding: 28 }}>
        <h2
          style={{
            margin: "0 0 18px",
            fontSize: 16,
            fontWeight: 700,
            color: "#1a2038",
          }}
        >
          Weekly Product Sales
        </h2>

        {loading && <p>Loading dashboard...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && chartData && (
          <Line data={chartData} options={lineOptions} />
        )}
      </div>
    </div>
  );
}