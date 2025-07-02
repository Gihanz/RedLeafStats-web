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
import CRSHeatmap from "../components/CRSHeatmap";
import RoundsCount from "../components/RoundsCount";
import RecentNews from "../components/RecentNews";
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

    {/* Main Grid Section: Chart + Stats */}
    <div className="flex flex-col lg:flex-row-reverse gap-6">
      {/* Right Column: Chart (comes first on small screens, left on large) */}
      <div className="flex-grow">
        <RoundsChart program={program} range={range} yAxisKey={yAxisKey} />
      </div>

      {/* Left Column: Stats (comes below on small screens, right on large) */}
      <div className="w-full lg:w-[320px] min-w-0 space-y-6 flex-shrink-0">
        <RoundStats program={program} range={range} yAxisKey={yAxisKey} />
        <RecentDraws setProgram={setProgram} />
      </div>
    </div>


    {/* Below Charts */}
    <ScoreDistribution program={program} range={range} />
    <TotalInvitationsChart />

    <RoundsCount program={program} range={range} />
    <CRSHeatmap program={program} range={range} />

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Checklist on the left */}
      <div className="lg:w-[420px] w-full flex-shrink-0">
        <Checklist />
      </div>

      {/* RecentNews full width */}
      <div className="flex-grow w-full">
        <RecentNews />
      </div>
    </div>


  </div>
</DashboardLayout>

  );
}
