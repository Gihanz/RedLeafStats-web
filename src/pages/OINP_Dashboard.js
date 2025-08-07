import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import LatestDrawCard from "../components/oinp/LatestDrawCard";
import GeneralRoundsChart from "../components/oinp/GeneralRoundsChart";
import InvitationsYearlyStats from "../components/oinp/InvitationsYearlyStats";
import IntStudntStrmDraws from "../components/oinp/IntStudntStrmDraws";
import ForeignWorkerStrmDraws from "../components/oinp/ForeignWorkerStrmDraws";
import IndemandSkillsStrmDraws from "../components/oinp/IndemandSkillsStrmDraws";
import MastersGraduateStrmDraws from "../components/oinp/MastersGraduateStrmDraws";
import PhDGraduateStrmDraws from "../components/oinp/PhDGraduateStrmDraws";
import EntrepreneurStrmDraws from "../components/oinp/EntrepreneurStrmDraws";

export default function Dashboard() {
  
  return (
    <DashboardLayout>
  
      <div className="space-y-6">
        <LatestDrawCard />
        <GeneralRoundsChart />
        <InvitationsYearlyStats />
        <ForeignWorkerStrmDraws />
        <IntStudntStrmDraws />
        <IndemandSkillsStrmDraws />
        <MastersGraduateStrmDraws />
        <PhDGraduateStrmDraws />
        <EntrepreneurStrmDraws />
      </div>
    
    </DashboardLayout>

  );
}
