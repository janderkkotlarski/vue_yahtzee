<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';
import Scorelist from './Scorelist.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const open = 'open';
const klik = 'klik';
const back = 'back';
const lock = 'lock';

let moreYahtzee = false;

const sameMax = ref(0);
const extraYahtzee = ref(0);
const yahtzeeNumber = ref(0);

const diceArray = reactive({
    dice: [],
});

const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceArray.dice.push({id: index, rolled: index});
    }
};

diceArrayFilling();

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const diceReroll = () => {
    for (const cube of diceArray.dice) {
        cube.rolled = roll();
    }
};

const rollYahtzee = number => {
    for (const cube of diceArray.dice) {
        cube.rolled = number;
    }
};

const rolling = number => {
    if (number >= 1 && number <= valueMax) {
        rollYahtzee(number);
    } else {
        diceReroll();
    }
};

const number = 0;

rolling(number);

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.dice[index - 1];
    }
};

const scoreUpper = reactive({
    scores: [
        {id: 1, title: 'Enen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 2, title: 'Tweeën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 3, title: 'Drieën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 4, title: 'Vieren', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 5, title: 'Vijfen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 6, title: 'Zessen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'summed', title: 'Getallen', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'bonus', title: 'Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'upper', title: 'Boven Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
    locks: 0,
});

const scoreLower = reactive({
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'four', title: '4 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'full', title: 'Full House', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'small', title: 'Kleine Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'large', title: 'Grote Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'chance', title: 'Kans', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0, final: 0, yonus: 'negate', locked: klik},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'lower', title: 'Lager Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
    locks: 0,
});

const multiples = reactive({
    counts: [],
});

const initMultiples = () => {
    for (let index = 1; index <= valueMax; ++index) {
        multiples.counts.push({id: index, count: 0});
    }
};

initMultiples();

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceArray.dice[index].rolled === number) {
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
    sameMax.value = 0;
    yahtzeeNumber.value = 0;

    let index = 1;

    for (const amount of multiples.counts) {
        amount.count = countNumber(index);

        if (sameMax.value < amount.count) {
            sameMax.value = amount.count;
        }

        if (sameMax.value === diceAmount) {
            yahtzeeNumber.value = index;
        }

        ++index;
    }
};

const entryLocking = (entry, score) => {
    entry.scored = entry.locked === lock ? 0 : score;
};

const diceSum = ref(0);

const countUpper = () => {
    diceSum.value = 0;

    for (const entry of scoreUpper.scores) {
        if (entry.locked != back) {
            const score = arrayEntry(multiples.counts, 'id', entry.id).count * entry.id;
            entryLocking(entry, score);
            diceSum.value += score;
        }
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

const lockList = list => {
    if (lockCount(list) > list.length - 4) {
        for (const entry of list) {
            if (entry.locked === back) {
                entry.locked = lock;
            }
        }
    }
};

const finalSummer = list => {
    let summed = 0;

    for (const entry of list) {
        if (entry.locked != back) {
            summed += entry.final;
        }
    }

    return summed;
};

const sumUpper = () => {
    const scores = scoreUpper.scores;
    const summed = finalSummer(scores);

    arrayEntry(scores, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scores, 'id', 'bonus').final = bonus;
    arrayEntry(scores, 'id', 'upper').final = summed + bonus;

    lockList(scores);
};

const multiYahtzee = () => {
    if (arrayEntry(scoreLower.scores, 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0) {
        return true;
    }

    return false;
};

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax.value === 3) {
        for (const amount of multiples.counts) {
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

    for (const amount of multiples.counts) {
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

    scoreSheet.push({id: 'three', score: sameMax.value >= 3 ? diceSum.value : 0});
    scoreSheet.push({id: 'four', score: sameMax.value >= 4 ? diceSum.value : 0});
    scoreSheet.push({id: 'full', score: filledHouse() ? 25 : 0});
    scoreSheet.push({id: 'small', score: consecutive() > 3 ? 30 : 0});
    scoreSheet.push({id: 'large', score: consecutive() > 4 ? 40 : 0});
    scoreSheet.push({id: 'chance', score: diceSum.value});
    scoreSheet.push({id: 'yahtzee', score: sameMax.value === diceAmount ? 50 : 0});

    return scoreSheet;
};

const countLower = () => {
    const scoreSheet = lowerScoring();

    for (const entry of scoreLower.scores) {
        if (entry.locked != back) {
            entryLocking(entry, arrayEntry(scoreSheet, 'id', entry.id).score);
        }
    }
};

const sumLower = () => {
    const scores = scoreLower.scores;
    const summed = finalSummer(scores);

    arrayEntry(scores, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scores, 'id', 'lower').final = summed;
    arrayEntry(scores, 'id', 'total').final =
        summed + extraYahtzee.value * 100 + arrayEntry(scoreUpper.scores, 'id', 'upper').final;

    if (lockCount(scoreUpper.scores) === scoreUpper.scores.length) {
        lockList(scores);
    }
};

const recount = () => {
    countMultiples();
    moreYahtzee = multiYahtzee();
    countUpper();
    sumUpper();
    countLower();
    sumLower();
};

recount();

const yahtzeeEyesLocked = index => {
    for (let eyes = 1; eyes <= valueMax; ++eyes) {
        if (arrayEntry(multiples.counts, 'id', eyes).count === diceAmount) {
            return (
                index === eyes ||
                (arrayEntry(scoreUpper.scores, 'id', eyes).locked === lock && typeof index != 'number') ||
                lockCount(scoreLower.scores) === scoreLower.scores.length
            );
        }
    }

    return true;
};

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        // If another yahtzee is scored, restrict scoring to official multiple yahtzee bonus scoring rules
        if (moreYahtzee ? yahtzeeEyesLocked(index) : true) {
            // When another yahtzee is scored, up the bonus
            if (moreYahtzee) {
                ++extraYahtzee.value;
            }

            score.final = score.scored;
            score.locked = lock;

            rolling(number);
            recount();
        }
    }
};

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }

    recount();
};

// <Scorelist :listing="scoreUpper.scores" />
</script>

<template>
    <div>
        <Dice
            @click="uptick(cube.id)"
            v-for="cube in diceArray.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="normal"
            :inverted="normal"
        />
    </div>

    <br />
    <br />

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
            </tr>
            <tr
                @click="lockEntry(scoreUpper, score.id)"
                v-for="score in scoreUpper.scores"
                :key="score.id"
                :class="score.locked"
            >
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td>{{ score.locked }}</td>
            </tr>
        </table>
    </div>

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
            </tr>
            <tr
                @click="lockEntry(scoreLower, score.id)"
                v-for="score in scoreLower.scores"
                :key="score.id"
                :class="score.locked"
            >
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td>{{ score.locked }}</td>
            </tr>
        </table>
    </div>

    <br />
    <br />

    <div>{{ lowerScoring() }}</div>

    <div>{{ multiples.counts }}</div>
</template>
