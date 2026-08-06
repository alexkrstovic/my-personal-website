// Sourced from "comparative competitor data sheet.xlsx" — 16-participant
// comparative usability study (8 expert, 8 novice), Zealty.ca vs REW.ca.
// Every mean below was independently recomputed from the raw per-participant
// rows and cross-checked against the workbook's own "Calculations" sheet.
// One exception: the workbook's Expert / "Task 1 Time" REW display cell
// (78.4375) is a copy-paste artifact pointing at the SUS mean instead of the
// task-1 time mean — its own T.TEST formula still reads the correct raw
// columns, so the p-value is unaffected. The correct mean (25.01875) is used
// here.

export type Group = "novice" | "expert";

// Exact colors from the Figma charts — a per-project accent pair (hot
// pink/magenta + gold) distinct from the site's global teal/gold, matching
// Zealty's own brand photography used elsewhere on this case study. Used
// across all four charts on this page for a consistent look.
export const CHART_COLORS = {
  zealty: "#fc4fd3",
  rew: "#ffb200",
};

export const taskLabels = ["Address Search", "Amenity Check", "Navigate & Sort", "Complex Filtering"];

export type TaskStat = {
  task: number;
  label: string;
  zealty: number;
  rew: number;
  pValue: number;
  interpretation: string;
};

export const susScores: Record<Group, { zealty: number; rew: number; n: number; pValue: number; interpretation: string }> = {
  novice: {
    zealty: 41.875,
    rew: 78.6875,
    n: 8,
    pValue: 0.001273280328,
    interpretation: "Significant - novice users strongly prefer REW over Zealty",
  },
  expert: {
    zealty: 56.5625,
    rew: 78.4375,
    n: 8,
    pValue: 0.01482052637,
    interpretation: "Significant - expert users prefer REW over Zealty",
  },
};

export const susBenchmarks = {
  b2c: { value: 75, label: "Benchmark B2C Consumer products" },
  b2b: { value: 57, label: "Benchmark B2B Professional products" },
};

export const taskTime: Record<Group, TaskStat[]> = {
  novice: [
    { task: 1, label: taskLabels[0], zealty: 54.3475, rew: 23.74875, pValue: 0.0882012003, interpretation: "Not significant - no reliable difference between Zealty and REW" },
    { task: 2, label: taskLabels[1], zealty: 25.18625, rew: 11.33875, pValue: 0.02931040155, interpretation: "Significant - REW is significantly faster than Zealty" },
    { task: 3, label: taskLabels[2], zealty: 71.9, rew: 33.4825, pValue: 0.006200386114, interpretation: "Significant - REW is significantly faster than Zealty" },
    { task: 4, label: taskLabels[3], zealty: 149.03125, rew: 89.315, pValue: 0.009802277277, interpretation: "Significant - REW is significantly faster than Zealty" },
  ],
  expert: [
    { task: 1, label: taskLabels[0], zealty: 54.6775, rew: 25.01875, pValue: 0.1737628541, interpretation: "Not significant - no reliable difference between Zealty and REW" },
    { task: 2, label: taskLabels[1], zealty: 45.41625, rew: 14.98375, pValue: 0.06766098452, interpretation: "Not significant - REW is faster, but the difference is not statistically reliable" },
    { task: 3, label: taskLabels[2], zealty: 99.47125, rew: 60.68, pValue: 0.138759024, interpretation: "Not significant - no reliable difference between Zealty and REW" },
    { task: 4, label: taskLabels[3], zealty: 161.24, rew: 58.63875, pValue: 0.0001105134004, interpretation: "Highly significant - REW is much faster than Zealty" },
  ],
};

export type ErrorStat = { task: number; label: string; zealty: number; rew: number };

export const avgErrors: Record<Group, ErrorStat[]> = {
  novice: [
    { task: 1, label: taskLabels[0], zealty: 1.375, rew: 0.25 },
    { task: 2, label: taskLabels[1], zealty: 0.375, rew: 0.25 },
    { task: 3, label: taskLabels[2], zealty: 0.5, rew: 0.375 },
    { task: 4, label: taskLabels[3], zealty: 1.5, rew: 0.625 },
  ],
  expert: [
    { task: 1, label: taskLabels[0], zealty: 1.125, rew: 0.625 },
    { task: 2, label: taskLabels[1], zealty: 0.5, rew: 0 },
    { task: 3, label: taskLabels[2], zealty: 1.75, rew: 0.375 },
    { task: 4, label: taskLabels[3], zealty: 4, rew: 0.875 },
  ],
};

// Full per-task descriptive stats, recomputed independently from the 16
// raw participant rows and cross-checked against the workbook's own
// "Calculations" sheet — every value matches exactly.
export const taskDescriptions = [
  "Locate the property at 5051 Imperial Street, Burnaby.",
  "Access the listing again and determine whether the building includes a gym.",
  "Navigate to Yaletown on the map, zoom in until street names are visible, locate the block between Hamilton and Mainland, and estimate the number of properties for sale.",
  "Apply filters to find condos meeting all of: 3+ bedrooms, 2+ bathrooms, built after 2010, pet-friendly.",
];

export type FullTaskStat = {
  mean: number;
  sd: number;
  n: number;
  min: number;
  max: number;
  successRate: number;
  avgErrors: number;
};

export const fullTaskStats: Record<Group, Record<number, { zealty: FullTaskStat; rew: FullTaskStat }>> = {
  novice: {
    1: {
      zealty: { mean: 54.35, sd: 46.53, n: 8, min: 14.09, max: 124.19, successRate: 87.5, avgErrors: 1.38 },
      rew: { mean: 23.75, sd: 8.08, n: 8, min: 11.31, max: 35.0, successRate: 100.0, avgErrors: 0.25 },
    },
    2: {
      zealty: { mean: 25.19, sd: 15.35, n: 8, min: 7.42, max: 54.91, successRate: 100.0, avgErrors: 0.38 },
      rew: { mean: 11.34, sd: 4.99, n: 8, min: 3.92, max: 21.48, successRate: 100.0, avgErrors: 0.25 },
    },
    3: {
      zealty: { mean: 71.9, sd: 30.36, n: 8, min: 37.42, max: 123.77, successRate: 100.0, avgErrors: 0.5 },
      rew: { mean: 33.48, sd: 14.8, n: 8, min: 18.46, max: 62.41, successRate: 87.5, avgErrors: 0.38 },
    },
    4: {
      zealty: { mean: 149.03, sd: 50.76, n: 8, min: 71.89, max: 202.69, successRate: 75.0, avgErrors: 1.5 },
      rew: { mean: 89.31, sd: 24.92, n: 8, min: 52.86, max: 120.34, successRate: 100.0, avgErrors: 0.62 },
    },
  },
  expert: {
    1: {
      zealty: { mean: 54.68, sd: 56.84, n: 8, min: 13.0, max: 187.0, successRate: 100.0, avgErrors: 1.12 },
      rew: { mean: 25.02, sd: 13.99, n: 8, min: 10.15, max: 51.0, successRate: 100.0, avgErrors: 0.62 },
    },
    2: {
      zealty: { mean: 45.42, sd: 41.85, n: 8, min: 12.33, max: 137.0, successRate: 100.0, avgErrors: 0.5 },
      rew: { mean: 14.98, sd: 11.75, n: 8, min: 6.87, max: 38.0, successRate: 100.0, avgErrors: 0.0 },
    },
    3: {
      zealty: { mean: 99.47, sd: 55.72, n: 8, min: 49.0, max: 216.0, successRate: 100.0, avgErrors: 1.75 },
      rew: { mean: 60.68, sd: 42.19, n: 8, min: 21.44, max: 144.0, successRate: 100.0, avgErrors: 0.38 },
    },
    4: {
      zealty: { mean: 161.24, sd: 46.57, n: 8, min: 85.0, max: 207.0, successRate: 50.0, avgErrors: 4.0 },
      rew: { mean: 58.64, sd: 28.63, n: 8, min: 22.0, max: 109.0, successRate: 100.0, avgErrors: 0.88 },
    },
  },
};

// SUS grades per Sauro (2011) curved grading scale.
export const susGrades: Record<Group, { zealty: string; rew: string }> = {
  novice: { zealty: "F", rew: "A-" },
  expert: { zealty: "D", rew: "B+" },
};
