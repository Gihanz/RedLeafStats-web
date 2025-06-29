import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Checklist from "../components/Checklist";
import Filters from "../components/Filters";
import RoundsChart from "../components/RoundsChart";
import RoundStats from "../components/RoundStats";
import RecentDraws from "../components/RecentDraws";
import ScoreDistribution from "../components/ScoreDistribution";
import TotalInvitationsChart from "../components/TotalInvitationsChart";
import LatestDrawCard from "../components/LatestDrawCard";
import useRounds from "../hooks/useRounds";

export default function Dashboard() {
  const [program, setProgram] = useState("Canadian Experience Class");
  const [range, setRange] = useState("All-time");
  const [yAxisKey, setYAxisKey] = useState("drawCRS");

  // Fetch all programs and yKeys for filter UI options
  const { programs, yKeys } = useRounds("All", "All-time");

  return (
    <DashboardLayout>
  <div className="space-y-6">
    {/* Top Section */}
    <LatestDrawCard />
    <Filters
      program={program}
      setProgram={setProgram}
      programs={programs}
      range={range}
      setRange={setRange}
      yAxisKey={yAxisKey}
      setYAxisKey={setYAxisKey}
      yKeys={yKeys}
    />

    {/* Main Grid Section: Stats + Chart */}
    <div className="flex flex-col lg:flex-row gap-6">
  {/* Left Column: Stats + Recent Draws */}
  <div className="w-full lg:w-[320px] space-y-6 flex-shrink-0">
    <RoundStats program={program} range={range} yAxisKey={yAxisKey} />
    <RecentDraws setProgram={setProgram} />
  </div>

  {/* Right Column: Chart takes full remaining space */}
  <div className="flex-grow">
    <RoundsChart program={program} range={range} yAxisKey={yAxisKey} />
  </div>
</div>


    {/* Below Charts */}
    <ScoreDistribution program={program} range={range} />
    <TotalInvitationsChart />

    {/* Checklist moved to bottom */}
    <Checklist />
  </div>
</DashboardLayout>

  );
}
