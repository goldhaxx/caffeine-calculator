import { addDays, addMinutes, differenceInMinutes, format } from 'date-fns';

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

// steady state is "reached" when less than this fraction of the asymptotic
// baseline remains unbuilt (1% → daysToSteadyState reports 99% convergence)
const STEADY_STATE_RESIDUAL = 0.01;

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
    if (!Number.isFinite(halfLife) || halfLife <= 0) return 0;
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

/**
 * Parses a 'HH:mm' string into fractional in-day hours.
 * Returns null for anything malformed — callers treat those doses as absent
 * so junk from localStorage or a cleared time input can't poison the math.
 */
export function parseTimeToHours(timeStr: string): number | null {
    const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours > 23 || minutes > 59) return null;
    return hours + minutes / 60.0;
}

export interface DecayChartOptions {
    days?: number;               // simulation horizon in days (default 1)
    shouldRepeatDaily?: boolean; // replicate the day-0 schedule every 24h (default false)
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
    const { days = 1, shouldRepeatDaily = false } = options;

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const validDoses = (Array.isArray(consumptions) ? consumptions : [])
        .map((cons) => ({ hour: parseTimeToHours(cons.time), mg: cons.mg }))
        .filter((dose): dose is { hour: number; mg: number } => dose.hour !== null)
        .sort((a, b) => a.hour - b.hour);

    if (validDoses.length === 0) {
        return { originDate: baseDate, doses: [] };
    }

    const originHour = Math.floor(validDoses[0].hour);
    const originDate = new Date(baseDate);
    originDate.setHours(originHour, 0, 0, 0);

    // repeating must never drop the day-0 schedule, even for a degenerate horizon
    const repeats = shouldRepeatDaily ? Math.max(1, days) : 1;
    const doses: DoseEvent[] = [];
    for (let day = 0; day < repeats; day++) {
        for (const dose of validDoses) {
            doses.push({ hourOffset: dose.hour - originHour + 24 * day, mg: dose.mg });
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
    if (!Array.isArray(consumptions) || consumptions.length === 0) return 0;

    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);

    const targetDt = timeToDate(targetTimeStr, baseDate);
    let totalRemaining = 0;

    for (const cons of consumptions) {
        const consDt = timeToDate(cons.time, baseDate);

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
    if (!Array.isArray(consumptions) || consumptions.length === 0) return null;

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
 * Chart label for an hour offset from the timeline origin.
 * Day 1 renders as a bare time; later calendar days get a "Day N" prefix.
 */
export function formatHourOffsetLabel(
    originDate: Date,
    hourOffset: number,
    style: 'tick' | 'tooltip' = 'tick'
): string {
    if (!Number.isFinite(hourOffset)) return '';
    const actual = addMinutes(originDate, Math.round(hourOffset * 60));
    const time = format(actual, style === 'tooltip' ? 'h:mm a' : 'ha');
    // days are 24h dose cycles from the origin — consistent with the trough
    // instants and the ramp card, so a 1-day chart never labels "Day 2"
    const dayNumber = Math.floor(hourOffset / 24) + 1;
    return dayNumber <= 1 ? time : `Day ${dayNumber} · ${time}`;
}

/**
 * One bedtime marker offset per simulated day, in continuous chart hours.
 */
export function computeBedtimeOffsets(bedtime: string, originDate: Date, days: number): number[] {
    const bedHour = parseTimeToHours(bedtime);
    if (bedHour === null) return [];
    const originHour = originDate.getHours() + originDate.getMinutes() / 60.0;
    let firstOffset = bedHour - originHour;
    if (firstOffset < 0) firstOffset += 24;
    return Array.from({ length: Math.max(0, days) }, (_, day) => firstOffset + 24 * day);
}

/**
 * X-axis tick offsets: 1-day charts align to wall-clock 4h marks (8AM, 12PM,
 * …) as the original chart did; multi-day horizons anchor to the dose cycle.
 */
export function computeChartTicks(originDate: Date, days: number): number[] {
    const ticks: number[] = [];
    if (days === 1) {
        const firstTick = (4 - (originDate.getHours() % 4)) % 4;
        for (let tick = firstTick; tick <= 24; tick += 4) ticks.push(tick);
        return ticks;
    }
    const spacing = days === 3 ? 12 : 24;
    for (let tick = 0; tick <= days * 24; tick += spacing) ticks.push(tick);
    return ticks;
}

export interface SteadyStateBaseline {
    troughMg: number;
    peakMg: number;
    daysToSteadyState: number;
}

/**
 * Closed-form steady state for a daily-repeating schedule.
 * Each dose contributes mg · 2^(−Δ/h) · Σf^k = mg · 2^(−Δ/h) / (1−f),
 * with f = 2^(−24/h). Decay is monotone between doses, so the trough
 * sits just before a dose and the peak just after one — no simulation.
 */
export function calculateSteadyStateBaseline(
    consumptions: Consumption[],
    halfLife: number
): SteadyStateBaseline | null {
    if (!Number.isFinite(halfLife) || halfLife <= 0) return null;
    if (!Array.isArray(consumptions)) return null;

    const doseHours = consumptions
        .map((cons) => ({ hour: parseTimeToHours(cons.time), mg: cons.mg }))
        .filter((dose): dose is { hour: number; mg: number } => dose.hour !== null);

    // no valid doses, or a decaf schedule: there is no baseline to claim
    if (doseHours.length === 0) return null;
    if (doseHours.reduce((sum, dose) => sum + dose.mg, 0) <= 0) return null;

    // fraction of a dose still circulating 24h later
    const dailyRetention = Math.pow(0.5, 24 / halfLife);
    const geometricSum = 1 / (1 - dailyRetention);

    // steady-state level just before in-day hour t
    const levelJustBefore = (t: number): number =>
        doseHours.reduce((sum, dose) => {
            let elapsed = (t - dose.hour) % 24;
            if (elapsed <= 0) elapsed += 24; // a dose at exactly t last fired 24h ago
            return sum + dose.mg * Math.pow(0.5, elapsed / halfLife) * geometricSum;
        }, 0);

    let troughMg = Infinity;
    let peakMg = -Infinity;

    for (const hour of new Set(doseHours.map((d) => d.hour))) {
        const before = levelJustBefore(hour);
        const doseAtInstant = doseHours
            .filter((d) => d.hour === hour)
            .reduce((sum, d) => sum + d.mg, 0);
        troughMg = Math.min(troughMg, before);
        peakMg = Math.max(peakMg, before + doseAtInstant);
    }

    const daysToSteadyState = Math.ceil(Math.log(STEADY_STATE_RESIDUAL) / Math.log(dailyRetention));

    return { troughMg, peakMg, daysToSteadyState };
}

export interface SteadyStateMathSummary {
    dailyIntakeMg: number;
    doseCount: number;
    retentionPct: number;     // % of a dose still circulating 24h later (2^(−24/h)·100)
    eliminationPct: number;   // % cleared per 24h — metabolism-dependent
    floorMg: number;          // steady-state trough
    postDoseMg: number;       // steady-state peak (just after a dose)
    daysToSteadyState: number;
}

/**
 * Live ingredients for the in-UI math explainer: half-life decay is
 * percentage-based (bathtub with an open drain), so a repeated daily intake
 * climbs only until daily elimination equals daily intake — the steady state.
 */
export function summarizeSteadyStateMath(
    consumptions: Consumption[],
    halfLife: number
): SteadyStateMathSummary | null {
    const steadyState = calculateSteadyStateBaseline(consumptions, halfLife);
    if (!steadyState) return null;

    const validDoses = consumptions
        .map((cons) => ({ hour: parseTimeToHours(cons.time), mg: cons.mg }))
        .filter((dose) => dose.hour !== null);

    const dailyRetention = Math.pow(0.5, 24 / halfLife);

    return {
        dailyIntakeMg: validDoses.reduce((sum, dose) => sum + dose.mg, 0),
        doseCount: validDoses.length,
        retentionPct: dailyRetention * 100,
        eliminationPct: (1 - dailyRetention) * 100,
        floorMg: steadyState.troughMg,
        postDoseMg: steadyState.peakMg,
        daysToSteadyState: steadyState.daysToSteadyState,
    };
}

export interface BaselineRampDay {
    day: number;
    troughMg: number;
    percentOfSteadyState: number;
}

/**
 * Day-over-day ramp of the daily floor when today's intake repeats daily.
 * Exact: decay is monotone between doses, so the day-k minimum sits
 * just-before a dose instant in (24(k−1), 24k] or at the cycle end 24k.
 * (A closed-form asymptote·(1−f^k) only holds when the steady-state trough
 * precedes the earliest dose — later doses have fired k−1 times, not k.)
 */
export function calculateBaselineRampUp(
    consumptions: Consumption[],
    halfLife: number,
    days: number = 7
): BaselineRampDay[] {
    const steadyState = calculateSteadyStateBaseline(consumptions, halfLife);
    if (!steadyState) return [];

    const { doses } = buildDoseTimeline(consumptions, { days, shouldRepeatDaily: true });
    const dayZeroOffsets = [...new Set(
        doses.filter((dose) => dose.hourOffset < 24).map((dose) => dose.hourOffset)
    )];

    return Array.from({ length: days }, (_, index) => {
        const day = index + 1;
        const sampleOffsets = [
            ...dayZeroOffsets.filter((offset) => offset > 0).map((offset) => offset + 24 * (day - 1)),
            24 * day,
        ];
        const troughMg = Math.min(
            ...sampleOffsets.map((offset) => calculateRemainingAtOffset(doses, offset, halfLife))
        );
        return {
            day,
            troughMg,
            percentOfSteadyState: (troughMg / steadyState.troughMg) * 100,
        };
    });
}

export interface DecayChartPoint {
    remaining: number;
    hourOffset: number;
    actualTime: Date;
}

/**
 * Generates decay chart data over a 1-N day horizon in 30-min steps.
 * Continuous decay — no clipping at the 24h boundary. With shouldRepeatDaily,
 * the day-0 schedule recurs every 24h so accumulation is visible.
 */
export function generateDecayChartData(
    consumptions: Consumption[],
    halfLife: number,
    options: DecayChartOptions = {}
): DecayChartPoint[] {
    if (!Number.isFinite(halfLife) || halfLife <= 0) return [];

    const { days = 1 } = options;
    const { originDate, doses } = buildDoseTimeline(consumptions, options);
    if (doses.length === 0) return [];

    const data: DecayChartPoint[] = [];

    for (let i = 0; i <= days * 48; i++) { // 30 min steps
        const hourOffset = i * 0.5;
        data.push({
            remaining: calculateRemainingAtOffset(doses, hourOffset, halfLife),
            hourOffset,
            actualTime: addMinutes(originDate, i * 30),
        });
    }

    return data;
}
