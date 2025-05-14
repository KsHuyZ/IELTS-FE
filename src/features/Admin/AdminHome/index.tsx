import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "./components/Overview";
import { StatsCards } from "./components/StatsCard";
import { ContentDistribution } from "./components/ContentDistribution";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { useState } from "react";
type TimeRange = "week" | "month" | "quarter" | "year";
const AdminHome = () => {
  const [visitTimeRange, setVisitTimeRange] = useState<TimeRange>("week");
  const [contentTimeRange, setContentTimeRange] = useState<TimeRange>("year");
  const getTimeRange = (range: TimeRange) => {
    const today = new Date();
    switch (range) {
      case "week":
        return {
          startDate: startOfWeek(today, { weekStartsOn: 1 }),
          endDate: endOfWeek(today, { weekStartsOn: 1 }),
        };
      case "month":
        return {
          startDate: startOfMonth(today),
          endDate: endOfMonth(today),
        };
      case "quarter":
        return {
          startDate: startOfQuarter(today),
          endDate: endOfQuarter(today),
        };
      case "year":
        return {
          startDate: startOfYear(today),
          endDate: endOfYear(today),
        };
      default:
        return {
          startDate: startOfWeek(today, { weekStartsOn: 1 }),
          endDate: endOfWeek(today, { weekStartsOn: 1 }),
        };
    }
  };
  const visitRange = getTimeRange(visitTimeRange);
  const contentRange = getTimeRange(contentTimeRange);
  return (
    <div className="container mx-auto p-4 md:p-8 pt-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of the system's data</p>
      </div>
      <div className="space-y-6">
        <StatsCards />
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Visits</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Number of visits over time</span>
                <Select
                  value={visitTimeRange}
                  onValueChange={(value: string) =>
                    setVisitTimeRange(value as TimeRange)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview
                startDate={visitRange.startDate}
                endDate={visitRange.endDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Proportion of content types on the system</span>
                <Select
                  value={contentTimeRange}
                  onValueChange={(value: string) =>
                    setContentTimeRange(value as TimeRange)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="quarter">Quarter</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentDistribution
                startDate={contentRange.startDate}
                endDate={contentRange.endDate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
