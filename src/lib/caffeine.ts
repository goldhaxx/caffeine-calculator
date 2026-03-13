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

export function timeToDate(timeStr: string, baseDate: Date = new Date()): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(baseDate);
    d.setHours(hours, minutes, 0, 0);
    return d;
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

/**
 * Generates decay chart data over 24 hours
 */
export function generateDecayChartData(consumptions: Consumption[], halfLife: number) {
    if (consumptions.length === 0) return [];

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const earliestCons = consumptions.reduce((earliest, current) => {
        return (current.time < earliest.time) ? current : earliest;
    });

    const startDt = timeToDate(earliestCons.time, baseDate);
    startDt.setMinutes(0, 0, 0);

    const data = [];

    for (let i = 0; i <= 24 * 2; i++) { // 24 hours, 30 min steps
        const currentDt = addMinutes(startDt, i * 30);
        const timeStr = format(currentDt, 'HH:mm');
        const remaining = calculateRemainingAtTime(consumptions, timeStr, halfLife);

        data.push({
            timeStr,
            remaining,
            hourOffset: i * 0.5,
            actualTime: currentDt
        });
    }

    return data;
}
