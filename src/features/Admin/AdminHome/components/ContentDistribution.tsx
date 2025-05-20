import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetRegistration } from "../hooks/useGetRegistration";
import { useEffect } from "react";

const data = [
  { name: "Exam", value: 142, color: "#0ea5e9" },
  { name: "Practice", value: 287, color: "#10b981" },
  { name: "Blog", value: 89, color: "#f59e0b" },
];
interface IProps {
  startDate: Date;
  endDate: Date;
}
export function ContentDistribution({ startDate, endDate }: IProps) {
  const { data: register ,refetch } = useGetRegistration({
    startDate,
    endDate,
  });
  useEffect(() => {
      refetch();
    }, [startDate, endDate]);
  
    const chartData = register?.map((item) => ({
      name: item.day,
      registrations: item.count,
    })) || [];
  
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
              })
            }
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value) => [`${value} registrations`, "Registrations"]}
            labelFormatter={(label) =>
              new Date(label).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }
          />
          <Line
            type="monotone"
            dataKey="registrations"
            stroke="#00a86b"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
}
