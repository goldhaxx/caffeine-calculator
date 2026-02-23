export type ToleranceStrategy = 'cold-turkey' | 'taper';

export interface TolerancePlan {
    strategy: ToleranceStrategy;
    startingDose: number;
    dailySteps: { day: number; dose: number; notes: string }[];
    totalDays: number;
    completionDate?: Date;
}

export function calculateTolerancePlan(
    currentIntake: number,
    strategy: ToleranceStrategy
): TolerancePlan {
    const steps: { day: number; dose: number; notes: string }[] = [];

    if (strategy === 'cold-turkey') {
        // 14 day reset for cold turkey
        const totalDays = 14;
        for (let i = 1; i <= totalDays; i++) {
            let notes = '';
            if (i <= 3) notes = 'Acute withdrawal phase: Expect headaches, fatigue, and irritability.';
            else if (i <= 9) notes = 'Sub-acute phase: Symptoms fading, but cravings may persist. Receptors beginning to downregulate.';
            else notes = 'Final phase: Adenosine receptors returning to baseline. Energy levels stabilizing.';

            steps.push({
                day: i,
                dose: 0,
                notes
            });
        }

        return {
            strategy,
            startingDose: currentIntake,
            dailySteps: steps,
            totalDays
        };
    } else {
        // Tapering: Reduce by 25% every 10 days
        let currentDose = currentIntake;
        let dayCount = 1;
        let complete = false;

        while (!complete) {
            for (let i = 0; i < 10; i++) {
                if (currentDose < 10) {
                    complete = true;
                    break;
                }

                let notes = '';
                if (i === 0) notes = 'Dose reduction day. May feel slight lethargy.';
                else if (i === 9) notes = 'Last day at this dose. Body should be acclimating.';
                else notes = 'Maintenance phase for current dose level.';

                steps.push({
                    day: dayCount,
                    dose: Math.round(currentDose),
                    notes
                });
                dayCount++;
            }
            currentDose = currentDose * 0.75;
        }

        // Final taper to 0
        const finalDays = 5;
        for (let i = 0; i < finalDays; i++) {
            steps.push({
                day: dayCount,
                dose: 0,
                notes: i === finalDays - 1 ? 'Tolerance fully reset.' : 'Final washout period.'
            });
            dayCount++;
        }

        return {
            strategy,
            startingDose: currentIntake,
            dailySteps: steps,
            totalDays: steps.length
        };
    }
}
