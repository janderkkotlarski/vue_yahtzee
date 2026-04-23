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

// Child components for this parent
import Divider from './VerticalDivider.vue';
import Multiples from './MultipleCounts.vue';
import Roller from './RollingDice.vue';
import ScoreList from './ScoreList.vue';

const diceAmount = 5;

const sameMax = ref(0);

const yahtzeeNumber = ref(0);
const extraYahtzee = ref(0);
const moreYahtzee = ref(0);

const rollVisible = ref(true);

const verticals = [];

const divides = 100;

for (let index = 1; index <= divides; ++index) {
    verticals.push({id: index});
}

const diceArray = ref({
    dice: [],
});

const multiplex = ref({
    counts: [],
});

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

const scoreUpper = ref(scoreUpperInit);
const scoreLower = ref(scoreLowerInit);

const startLocking = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);

    if (sameMax.value === 0) {
        for (const entry of scoresU) {
            if (entry.locked != back && entry.locked != lack && entry.locked != lock) {
                entry.locked = klak;
            }
        }

        for (const entry of scoresL) {
            if (entry.locked != back && entry.locked != lack && entry.locked != lock) {
                entry.locked = klak;
            }
        }
    }
};

startLocking();

const countUpper = () => {
    for (const entry of scoress(scoreUpper)) {
        if (entry.locked != back && entry.locked != lack) {
            const score = arrayEntry(multiplex.value.counts, 'id', entry.id).count * entry.id;
            entryLocking(entry, score);
        }
    }
};

const sumUpper = () => {
    const scoresU = scoress(scoreUpper);
    const summed = finalSummer(scoresU);

    arrayEntry(scoresU, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scoresU, 'id', 'bonus').final = bonus;
    arrayEntry(scoresU, 'id', 'upper').final = summed + bonus;
};

const multiYahtzee = () => {
    if (arrayEntry(scoress(scoreLower), 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0) {
        moreYahtzee.value = -1;
    }

    multiplesRef.value.moarYahtzee = moreYahtzee.value;
};

const klikable = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);

    deklak(scoresU);
    deklak(scoresL);

    startLocking();

    if (moreYahtzee.value === -1) {
        if (arrayEntry(scoresU, 'id', yahtzeeNumber.value).locked != lock || lockCount(scoresL) + 3 < scoresL.length) {
            for (const entry of scoresU) {
                if (entry.locked === klik && entry.id != yahtzeeNumber.value) {
                    entry.locked = klak;
                }
            }
        }

        if (arrayEntry(scoresU, 'id', yahtzeeNumber.value).locked != lock) {
            for (const entry of scoresL) {
                if (entry.locked === klik) {
                    entry.locked = klak;
                }
            }
        }
    }
};

let diceSum = 0;

const summing = () => {
    diceSum = 0;

    for (const cube of diceArray.value.dice) {
        diceSum += cube.rolled;
    }
};

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

const countLower = () => {
    const scoreSheet = lowerScoring();

    for (const entry of scoress(scoreLower)) {
        if (entry.locked != back) {
            entryLocking(entry, arrayEntry(scoreSheet, 'id', entry.id).score);
        }
    }
};

const sumLower = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);
    const summed = finalSummer(scoresL);

    arrayEntry(scoresL, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scoresL, 'id', 'lower').final = summed;
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
        if (moreYahtzee.value === -1) {
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

// <div v-for="divide in verticals" :key="verticals.id"><Divider :class="divide.id" /></div>
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

    <Divider v-for="divide in verticals" :key="divide.id" />

    <button v-if="rollVisible" class="switch" @click="restart">Herstart</button>
</template>
