export type Calendar = Record<string, Record<string, EventData[]>>;

export interface SelectedEventContext {
  day: string;
  hour: string;
  index: number;
}

export interface EventData {
  startTime: string;
  endTime: string; 
  day: string;
  hour?: string;
  title: string;
  color: string;
  time?: string;
}

