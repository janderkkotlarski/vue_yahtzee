<script setup>
import {ref} from 'vue';
import Dice from './Dice.vue';
import RollTest from './RollTest.vue';
import Scorelist from './Scorelist.vue';
import Scoring from './Scoring.vue';
import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './Varinit.mjs';

import {countMultiples_} from './Functinit.mjs';

const rollingRef = ref(null);

const rollingParent = () => {
    rollingRef.value.rolling();
};

const recountRef = ref(null);

const recountParent = () => {
    recountRef.value.recount();
};

const valueMax = 6;
const diceAmount = 5;
const rollNumber = 0;

const normal = '______';

let sameMax = 0;
const extraYahtzee = ref(0);
const yahtzeeNumber = ref(0);
let moreYahtzee = false;

const diceArray = ref({
    dice: [],
});

const diceRow = defineModel('diceRow', {type: Object, default: {dice: []}});

const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceArray.value.dice.push({id: index, rolled: index});
    }
};

diceArrayFilling();

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.value.dice[index - 1];
    }
};

const scoreUpper = ref(scoreUpperInit);
const scoreLower = ref(scoreLowerInit);

const scoress = list => {
    return list.value.scores;
};

const multiples = ref({
    counts: [],
});

const initMultiples = () => {
    for (let index = 1; index <= valueMax; ++index) {
        multiples.value.counts.push({id: index, count: 0});
    }
};

initMultiples();

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceArray.value.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

const arrayEntry = (array, key, value) => {
    for (const entry of array) {
        if (entry[key] === value) {
            return entry;
        }
    }
};

const countMultiples = () => {
    sameMax = 0;
    yahtzeeNumber.value = 0;

    let index = 1;
    let yahtzee = false;

    for (const amount of multiples.value.counts) {
        amount.count = countNumber(index);

        if (sameMax < amount.count) {
            sameMax = amount.count;
        }

        // yahtzee needed so yahtzeeNumber does not go to 6 when index gets upped
        if (sameMax === diceAmount && !yahtzee) {
            yahtzeeNumber.value = index;

            yahtzee = true;
        }

        ++index;
    }
};

const entryLocking = (entry, score) => {
    entry.scored = entry.locked === lock ? 0 : score;
};

let diceSum = 0;

const summing = () => {
    diceSum = 0;

    for (const cube of diceArray.value.dice) {
        diceSum += cube.rolled;
    }
};

const countUpper = () => {
    let index = 1;

    for (const entry of scoress(scoreUpper)) {
        if (entry.locked != back && entry.locked != lack) {
            const score = arrayEntry(multiples.value.counts, 'id', entry.id).count * entry.id;
            entryLocking(entry, score);
        }

        ++index;
    }
};

const lockCount = list => {
    let locks = 0;

    for (const entry of list) {
        if (entry.locked === lock) {
            ++locks;
        }
    }

    return locks;
};

const lackCount = list => {
    let lacks = 0;

    for (const entry of list) {
        if (entry.locked === lack) {
            ++lacks;
        }
    }

    return lacks;
};

const lockList = list => {
    if (lockCount(list) > list.length - 4) {
        for (const entry of list) {
            if (entry.locked === back) {
                entry.locked = lack;
            }
        }
    }
};

const finalSummer = list => {
    let summed = 0;

    for (const entry of list) {
        if (entry.locked === klik || entry.locked === lock) {
            summed += entry.final;
        }
    }

    return summed;
};

const sumUpper = () => {
    const scoresU = scoress(scoreUpper);
    const summed = finalSummer(scoresU);

    arrayEntry(scoresU, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scoresU, 'id', 'bonus').final = bonus;
    arrayEntry(scoresU, 'id', 'upper').final = summed + bonus;

    lockList(scoresU);
};

const multiYahtzee = () => {
    moreYahtzee = arrayEntry(scoress(scoreLower), 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0;
};

const deklak = list => {
    for (const entry of list) {
        if (entry.locked === klak) {
            entry.locked = klik;
        }
    }
};

const klikable = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);

    deklak(scoresU);
    deklak(scoresL);

    if (moreYahtzee) {
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

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax === 3) {
        for (const amount of multiples.value.counts) {
            if (amount.count == 2) {
                return true;
            }
        }
    }

    return moreYahtzee;
};

// Check whether 4 or 5 consecutive numeric values can be found among the thrown dice
const consecutive = () => {
    let consec = 0;
    let counted = 0;

    for (const amount of multiples.value.counts) {
        counted = amount.count ? counted + 1 : 0;

        if (counted > consec) {
            consec = counted;
        }
    }

    if (moreYahtzee) {
        consec = 5;
    }

    return consec;
};

const lowerScoring = () => {
    const scoreSheet = [];

    scoreSheet.push({id: 'three', score: sameMax >= 3 ? diceSum : 0});
    scoreSheet.push({id: 'four', score: sameMax >= 4 ? diceSum : 0});
    scoreSheet.push({id: 'full', score: filledHouse() ? 25 : 0});
    scoreSheet.push({id: 'small', score: consecutive() > 3 ? 30 : 0});
    scoreSheet.push({id: 'large', score: consecutive() > 4 ? 40 : 0});
    scoreSheet.push({id: 'chance', score: diceSum});
    scoreSheet.push({id: 'yahtzee', score: sameMax === diceAmount ? 50 : 0});

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

const fullyLocking = list => {
    return lockCount(list) + lackCount(list) === list.length;
};

const sumLower = () => {
    const scoresU = scoress(scoreUpper);
    const scoresL = scoress(scoreLower);
    const summed = finalSummer(scoresL);

    arrayEntry(scoresL, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scoresL, 'id', 'lower').final = summed;
    arrayEntry(scoresL, 'id', 'total').final =
        summed + extraYahtzee.value * 100 + arrayEntry(scoresU, 'id', 'upper').final;

    if (fullyLocking(scoresU)) {
        lockList(scoresL);
    }
};

const recount = () => {
    // countMultiples_(multiples, yahtzeeNumber, diceAmount, sameMax);
    countMultiples();
    multiYahtzee();
    klikable();
    summing();
    countUpper();
    sumUpper();
    countLower();
    sumLower();
};

recountParent();

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        // When another yahtzee is scored, up the bonus
        if (moreYahtzee) {
            ++extraYahtzee.value;
        }

        score.final = score.scored;
        score.locked = lock;

        rollingParent();

        // recount();

        recountParent();
    }
};

// <RollTest />
// <div>{{ yahtzeeNumber }}</div>

// <RollTest @rescan="recount" :diceLine="diceArray" />

// <Scorelist @locker="lockEntry" :scoreListing="scoreUpper" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
// <Scorelist @locker="lockEntry" :scoreListing="scoreLower" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
</script>

<template>
    <RollTest @rescan="recount" ref="rollingRef" :diceLine="diceArray" />

    <br />
    <br />

    <Scoring ref="recountRef" :scoreUpperList="scoreUpper" :scoreLowerList="scoreLower" />

    <Scorelist @locker="lockEntry" :scoreListing="scoreUpper" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
    <Scorelist @locker="lockEntry" :scoreListing="scoreLower" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
</template>
