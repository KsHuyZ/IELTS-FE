import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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
  const { refetch } = useGetRegistration({
    startDate,
    endDate,
  });
  useEffect(() => {
    refetch();
  }, [startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
