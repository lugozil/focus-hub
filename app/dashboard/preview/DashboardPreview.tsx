"use client";

import { useMemo, useState } from "react";
import { DashboardView, type Range } from "../DashboardView";
import { mockDashboardData } from "./mockData";

export function DashboardPreview() {
  const [range, setRange] = useState<Range>(30);
  const data = useMemo(() => mockDashboardData(range), [range]);
  return <DashboardView data={data} range={range} onRangeChange={setRange} sample />;
}
