export interface TimelineItem {
  year: number;
  pathA: string;
  pathB: string;
}

export interface ChartDataPoint {
  year: number;
  pathA: number;
  pathB: number;
}

export interface MicroHabitItem {
  action: string;
  howToImprove: string;
}

export interface SimulationResult {
  timeline: TimelineItem[];
  narrativeA: string;
  narrativeB: string;
  microHabits: (string | MicroHabitItem)[];
  chartData: ChartDataPoint[];
}

export interface UserInput {
  age: number | "";
  goal: string;
  habits: string;
}
