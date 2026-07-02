import { addDays, addMinutes, differenceInMinutes, parse, format } from 'date-fns';

export interface Consumption {
    id: string;
    time: string; // format 'HH:mm'
    mg: number;
}

export const METABOLISM_HALF_LIVES = {
    fast: 3.0,
    average: 5.0,
    slow: 8.0,
};

export type MetabolismType = keyof typeof METABOLISM_HALF_LIVES;

export const SENSITIVITY_THRESHOLDS = {
    sensitive: 15,
    average: 30,
    tolerant: 50,
};

export type SensitivityType = keyof typeof SENSITIVITY_THRESHOLDS;

export interface DoseEvent {
    hourOffset: number; // hours since the timeline origin
    mg: number;
}

/**
 * Continuous-time decay: remaining caffeine at an hour offset from the
 * timeline origin. No time-of-day wrapping — offsets past 24h keep decaying.
 * A sample at exactly a dose instant reads just-before-dose (elapsed > 0).
 */
export function calculateRemainingAtOffset(
    doses: DoseEvent[],
    targetHour: number,
    halfLife: number
): number {
    let total = 0;
    for (const dose of doses) {
        const elapsed = targetHour - dose.hourOffset;
        if (elapsed > 0) {
            total += dose.mg * Math.pow(0.5, elapsed / halfLife);
        }
    }
    return total;
}

export function timeToDate(timeStr: string, baseDate: Date = new Date()): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export interface DecayChartOptions {
    days?: number;         // simulation horizon in days (default 1)
    repeatDaily?: boolean; // replicate the day-0 schedule every 24h (default false)
}

export interface DoseTimeline {
    originDate: Date;
    doses: DoseEvent[];
}

/**
 * Expands a daily consumption schedule into continuous dose events.
 * Origin = earliest consumption floored to the hour (chart anchor).
 */
export function buildDoseTimeline(
    consumptions: Consumption[],
    options: DecayChartOptions = {}
): DoseTimeline {
    const { days = 1, repeatDaily = false } = options;

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    if (consumptions.length === 0) {
        return { originDate: baseDate, doses: [] };
    }

    const earliestCons = consumptions.reduce((earliest, current) => {
        return (current.time < earliest.time) ? current : earliest;
    });

    const originDate = timeToDate(earliestCons.time, baseDate);
    originDate.setMinutes(0, 0, 0);

    const dayZero: DoseEvent[] = consumptions
        .map((cons) => ({
            hourOffset: differenceInMinutes(timeToDate(cons.time, baseDate), originDate) / 60.0,
            mg: cons.mg,
        }))
        .sort((a, b) => a.hourOffset - b.hourOffset);

    const repeats = repeatDaily ? days : 1;
    const doses: DoseEvent[] = [];
    for (let day = 0; day < repeats; day++) {
        for (const dose of dayZero) {
            doses.push({ hourOffset: dose.hourOffset + 24 * day, mg: dose.mg });
        }
    }

    return { originDate, doses };
}

/**
 * Calculates the amount of caffeine remaining in the body at a given target time.
 */
export function calculateRemainingAtTime(
    consumptions: Consumption[],
    targetTimeStr: string,
    halfLife: number
): number {
    if (consumptions.length === 0) return 0;

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    let targetDt = timeToDate(targetTimeStr, baseDate);
    let totalRemaining = 0;

    for (const cons of consumptions) {
        let consDt = timeToDate(cons.time, baseDate);

        // If target time is before consumption time (e.g., cons at 22:00, target at 08:00)
        // assume target is on the next day
        let adjustedTargetDt = new Date(targetDt);
        if (adjustedTargetDt < consDt) {
            adjustedTargetDt = addDays(adjustedTargetDt, 1);
        }

        const minutesElapsed = differenceInMinutes(adjustedTargetDt, consDt);
        if (minutesElapsed > 0) {
            const hoursElapsed = minutesElapsed / 60.0;
            const decay = Math.pow(0.5, hoursElapsed / halfLife);
            totalRemaining += cons.mg * decay;
        }
    }

    return Math.round(totalRemaining * 10) / 10;
}

/**
 * Calculates safe sleep windows based on latest consumption.
 */
export function calculateSafeSleepWindows(consumptions: Consumption[], halfLife: number) {
    if (consumptions.length === 0) return null;

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    // Find latest consumption
    const latestCons = consumptions.reduce((latest, current) => {
        return (current.time > latest.time) ? current : latest;
    });

    const latestDt = timeToDate(latestCons.time, baseDate);
    const startDt = addMinutes(latestDt, 30);

    const windows: Record<string, string | null> = {};

    for (const [sensName, thresh] of Object.entries(SENSITIVITY_THRESHOLDS)) {
        let currentDt = new Date(startDt);
        let foundStr: string | null = null;

        // search up to 24h in 15m steps
        for (let i = 0; i <= 24 * 4; i++) {
            const timeStr = format(currentDt, 'HH:mm'); // keep 24h for calc logic
            const formattedAmPm = format(currentDt, 'h:mm a'); // 12h for display
            const rem = calculateRemainingAtTime(consumptions, timeStr, halfLife);

            if (rem <= thresh + 0.1) {
                foundStr = formattedAmPm;
                break;
            }
            currentDt = addMinutes(currentDt, 15);
        }

        windows[sensName] = foundStr;
    }

    return windows;
}

export interface DecayChartPoint {
    timeStr: string;
    remaining: number;
    hourOffset: number;
    actualTime: Date;
    dayIndex: number;
}

/**
 * Generates decay chart data over a 1-N day horizon in 30-min steps.
 * Continuous decay — no clipping at the 24h boundary. With repeatDaily,
 * the day-0 schedule recurs every 24h so accumulation is visible.
 */
export function generateDecayChartData(
    consumptions: Consumption[],
    halfLife: number,
    options: DecayChartOptions = {}
): DecayChartPoint[] {
    if (consumptions.length === 0) return [];

    const { days = 1 } = options;
    const { originDate, doses } = buildDoseTimeline(consumptions, options);

    const data: DecayChartPoint[] = [];

    for (let i = 0; i <= days * 48; i++) { // 30 min steps
        const hourOffset = i * 0.5;
        const currentDt = addMinutes(originDate, i * 30);

        data.push({
            timeStr: format(currentDt, 'HH:mm'),
            remaining: calculateRemainingAtOffset(doses, hourOffset, halfLife),
            hourOffset,
            actualTime: currentDt,
            dayIndex: Math.floor(hourOffset / 24),
        });
    }

    return data;
}
