import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetVisit } from "../hooks/useGetVisit";
import { useEffect } from "react";

interface IProps {
  startDate: Date;
  endDate: Date;
}

export function Overview({ startDate, endDate }: IProps) {
  const { data: visits, refetch } = useGetVisit({ startDate, endDate });

  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  const chartData = visits?.map((item) => ({
    name: item.date,
    visits: item.count,
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
          formatter={(value) => [`${value} visits`, "Visits"]}
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
          dataKey="visits"
          stroke="#0ea5e9"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}