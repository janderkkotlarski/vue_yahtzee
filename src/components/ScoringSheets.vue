<script setup>
import {ref} from 'vue';
// Necessary variables
import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './Scoringvars.mjs';
// Functions that could be stashed away
import {
    scoress,
    entryLocking,
    arrayEntry,
    lockCount,
    lockList,
    finalSummer,
    deklak,
    fullyLocking,
    restart,
} from './Scoringfunctions.mjs';

import Divider from './VerticalDivider.vue';
import Multiples from './MultipleCounts.vue';
import Roller from './RollingDice.vue';
import ScoreList from './ScoreList.vue';

const diceAmount = 5;

// Max amount of same dice results
const sameMax = ref(0);

// Number of the yahtzee result
const yahtzeeNumber = ref(0);
// Amount of extra yahtzees scored
const extraYahtzee = ref(0);
// Is an extra yahtzee scored?
const moreYahtzee = ref(0);

// Visible while the game is in session
const rollVisible = ref(true);

// Vertical divides
const verticals = [];

// Amount of vertical divides
const divides = 100;

// Build an array for v-for logic
for (let index = 1; index <= divides; ++index) {
    verticals.push({id: index});
}

// Array of throwable dice
const diceArray = ref({
    dice: [],
});

// Array for counted results
const multiplex = ref({
    counts: [],
});

// defineExpose coupling for Multiples
const multiplesRef = ref(null);

const countMultiplesParent = () => {
    yahtzeeNumber.value = multiplesRef.value.countMultiples();

    return multiplesRef.value.sameMax;
};

const watchFilledHouse = () => {
    return multiplesRef.value.filledHouse();
};

const watchConsecutive = () => {
    return multiplesRef.value.consecutive();
};

// defineExpose coupling for Roller
const rollingRef = ref(null);

const resetRollingArray = () => {
    rollingRef.value.diceArrayReset();
};

const getRollingNumber = () => {
    return rollingRef.value.currentNumber;
};

const lowerRollingNumber = () => {
    rollingRef.value.lowerCurrentNumber();
};

// Scorelist initialization
const scoreUpper = ref(scoreUpperInit);
const scoreLower = ref(scoreLowerInit);

// Turn all kliks into klaks
const startKlaking = () => {
    // Turn the scores into an array for more compact code
    const scoresUL = [scoress(scoreUpper), scoress(scoreLower)];

    // Check whether there is a new round
    if (sameMax.value === 0) {
        for (const scores of scoresUL) {
            // If an entry has klik, it now is klak
            for (const entry of scores) {
                if (entry.locked === klik) {
                    entry.locked = klak;
                }
            }
        }  
    }
};

startKlaking();

// Count the score for each upper entry
const countUpper = () => {
    for (const entry of scoress(scoreUpper)) {
        // If it is a legitimite entry
        if (entry.locked != back /*&& entry.locked != lack*/) {
            // Score is number of dice rolls times that rolled value
            const score = arrayEntry(multiplex.value.counts, 'id', entry.id).count * entry.id;
            // Check the locked status and enter an appropriate socre
            entryLocking(entry, score);
        }
    }
};

// Sum the upper scores and calculate totals and bonus
const sumUpper = () => {
    const scoresU = scoress(scoreUpper);
    const summed = finalSummer(scoresU);

    arrayEntry(scoresU, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scoresU, 'id', 'bonus').final = bonus;
    arrayEntry(scoresU, 'id', 'upper').final = summed + bonus;
};

// If the first yahtzee was finalized and a yahtzee is detected, then there is another yahtzee
const multiYahtzee = () => {
    if (arrayEntry(scoress(scoreLower), 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0) {
        moreYahtzee.value = 1;
    }

    multiplesRef.value.moarYahtzee = moreYahtzee.value;
};

// Determine clickable entries
const klikable = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);

    // First make all clickable
    deklak(scoresU);
    deklak(scoresL);

    // Then check wat cannot be clicked
    // Only does something for the start of a round
    startKlaking();

    // When there is another yahtzee
    if (moreYahtzee.value === 1) {
        // If the upper number entry for the yahtzee value is clickable
        if (arrayEntry(scoresU, 'id', yahtzeeNumber.value).locked != lock) {
            // Klak all of scoreL entries
            for (const entry of scoresL) {
                if (entry.locked === klik) {
                    entry.locked = klak;
                }
            }

            // If the lower scores are not fully locked
            if (lockCount(scoresL) + 3 < scoresL.length) {
                for (const entry of scoresU) {
                    // Klak all values not having a yahtzee
                    if (entry.locked === klik && entry.id != yahtzeeNumber.value) {
                        entry.locked = klak;
                    }
                }
            }
        }
    }
};

let diceSum = 0;

// Sum all dice results
const summing = () => {
    diceSum = 0;

    for (const cube of diceArray.value.dice) {
        diceSum += cube.rolled;
    }
};

// Lower score calculations
const lowerScoring = () => {
    const scoreSheet = [];

    scoreSheet.push({id: 'three', score: sameMax.value >= 3 ? diceSum : 0});
    scoreSheet.push({id: 'four', score: sameMax.value >= 4 ? diceSum : 0});
    scoreSheet.push({id: 'full', score: watchFilledHouse() != 0 ? 25 : 0});
    scoreSheet.push({id: 'small', score: watchConsecutive() > 3 ? 30 : 0});
    scoreSheet.push({id: 'large', score: watchConsecutive() > 4 ? 40 : 0});
    scoreSheet.push({id: 'chance', score: diceSum});
    scoreSheet.push({id: 'yahtzee', score: sameMax.value === diceAmount ? 50 : 0});

    return scoreSheet;
};

// Count the lower score entries
const countLower = () => {
    const scoreSheet = lowerScoring();

    for (const entry of scoress(scoreLower)) {
        if (entry.locked != back) {
            entryLocking(entry, arrayEntry(scoreSheet, 'id', entry.id).score);
        }
    }
};

// Sum the lower scores and calculate totals and bonus
const sumLower = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);
    const summed = finalSummer(scoresL);

    arrayEntry(scoresL, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scoresL, 'id', 'lower').final = summed + extraYahtzee.value * 100;
    arrayEntry(scoresL, 'id', 'total').final =
        summed + extraYahtzee.value * 100 + arrayEntry(scoresU, 'id', 'upper').final;
};

const countMultiples = () => {
    sameMax.value = countMultiplesParent();
};

const recount = () => {
    countMultiples();
    multiYahtzee();
    klikable();
    summing();
    countUpper();
    sumUpper();
    countLower();
    sumLower();
};

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        const scoresU = scoress(scoreUpper);
        const scoresL = scoress(scoreLower);

        // When another yahtzee is scored, up the bonus
        if (moreYahtzee.value === 1) {
            ++extraYahtzee.value;
        }

        score.final = score.scored;
        score.locked = lock;

        lockList(scoresU);

        if (fullyLocking(scoresU)) {
            recount();

            lockList(scoresL);

            if (fullyLocking(scoresL)) {
                sumLower();
                rollVisible.value = false;
            }
        }

        if (lockCount(scoresL) > scoresL.length - 4 && getRollingNumber() > 0) {
            lowerRollingNumber();
        }

        moreYahtzee.value = 0;
        multiplesRef.value.moarYahtzee = moreYahtzee.value;

        resetRollingArray();
        recount();
    }
};
</script>

<template>
    <Multiples ref="multiplesRef" :multiples="multiplex" :diceLine="diceArray" />

    <Roller
        ref="rollingRef"
        @recounting="recount"
        @resetMultiples="countMultiples"
        :diceLine="diceArray"
        :buttonVisible="rollVisible"
    />

    <Divider />

    <ScoreList @locker="lockEntry" :scoreListing="scoreUpper" />
    <ScoreList @locker="lockEntry" :scoreListing="scoreLower" />

    <div v-if="rollVisible">
        <Divider v-for="divide in verticals" :key="divide.id" />

        <button class="switch" @click="restart">Herstart</button>
    </div>
</template>
