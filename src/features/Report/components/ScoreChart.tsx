import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetScoreChart } from "../hooks/useGetScoreChart";
import { useEffect } from "react";
import { IChart } from "@/types/report";

interface ScoreChartProps {
  skill: string;
  startDate?: Date;
  endDate?: Date;
}

export function ScoreChart({ skill, startDate, endDate }: ScoreChartProps) {
  const { data, refetch } = useGetScoreChart({
    startTime: startDate,
    endTime: endDate,
  });
  useEffect(() => {
    refetch();
  }, [startDate, endDate]);
  const chartData = (data as IChart[]) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        {/* Change dataKey from "name" to "date" */}
        <XAxis
          dataKey="date"
          tickFormatter={(date) => {
            // Optional: Format the date string as needed
            return new Date(date).toLocaleDateString();
          }}
        />
        <YAxis domain={[0, 9]} ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} interval={0}/>
        <Tooltip
          labelFormatter={(label) => {
            // Optional: Format the tooltip label
            return new Date(label).toLocaleDateString();
          }}
        />
        <Legend />
        {skill === "all" || skill === "speaking" ? (
          <Line
            type="monotone"
            dataKey="speaking"
            stroke="#ef4444"
            activeDot={{ r: 8 }}
            name="Speaking"
          />
        ) : null}
        {skill === "all" || skill === "reading" ? (
          <Line
            type="monotone"
            dataKey="reading"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            name="Reading"
          />
        ) : null}
        {skill === "all" || skill === "writing" ? (
          <Line
            type="monotone"
            dataKey="writing"
            stroke="#22c55e"
            activeDot={{ r: 8 }}
            name="Writing"
          />
        ) : null}
        {skill === "all" || skill === "listening" ? (
          <Line
            type="monotone"
            dataKey="listening"
            stroke="#eab308"
            activeDot={{ r: 8 }}
            name="Listening"
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );
}
