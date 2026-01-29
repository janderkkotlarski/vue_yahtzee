<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const open = 'open';
const lock = 'lock';

const times = ' keer';

let lowerLocks = 0;
const extraYahtzee = ref(0);

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

diceReroll();

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.dice[index - 1];
    }
};

const scoreUpper = reactive({
    scores: [
        {id: 1, title: 'Enen', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 2, title: 'Tweeën', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 3, title: 'Drieën', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 4, title: 'Vieren', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 5, title: 'Vijfen', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 6, title: 'Zessen', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'summed', title: 'Getallen', scored: ' ', final: 0, yonus: 'never', locked: open},
        {id: 'bonus', title: 'Bonus', scored: ' ', final: 0, yonus: 'never', locked: open},
        {id: 'upper', title: 'Boven Totaal', scored: ' ', final: 0, yonus: 'never', locked: open},
    ],
});

const scoreLower = reactive({
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'four', title: '4 Gelijke', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'full', title: 'Full House', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'small', title: 'Kleine Straat', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'large', title: 'Grote Straat', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'chance', title: 'Kans', scored: 0, final: 0, yonus: 'null', locked: open},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0, final: 0, yonus: 'negate', locked: open},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: ' ', final: 0, yonus: 'never', locked: open},
        {id: 'lower', title: 'Lager Totaal', scored: ' ', final: 0, yonus: 'never', locked: open},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', final: 0, yonus: 'never', locked: open},
    ],
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
    for (let index = 1; index <= valueMax; ++index) {
        arrayEntry(multiples.counts, 'id', index).count = countNumber(index);
    }
};

const diceSum = ref(0);

const countUpper = () => {
    diceSum.value = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const score = arrayEntry(multiples.counts, 'id', number).count * number;

        arrayEntry(scoreUpper.scores, 'id', number).scored = score;
        diceSum.value += score;
    }
};

const lockFully = entryArray => {
    let lockCount = 0;

    for (const entry of entryArray) {
        if (entry.locked === lock) {
            ++lockCount;
        }
    }

    if (lockCount >= entryArray.length - 3) {
        return true;
    }

    return false;
};

const sumUpper = () => {
    let summed = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const entry = arrayEntry(scoreUpper.scores, 'id', number);

        summed += entry.final;
    }

    arrayEntry(scoreUpper.scores, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scoreUpper.scores, 'id', 'bonus').final = bonus;
    arrayEntry(scoreUpper.scores, 'id', 'upper').final = summed + bonus;

    if (lockFully(scoreUpper.scores)) {
        arrayEntry(scoreUpper.scores, 'id', 'summed').locked = lock;
        arrayEntry(scoreUpper.scores, 'id', 'bonus').locked = lock;
        arrayEntry(scoreUpper.scores, 'id', 'upper').locked = lock;
    }
};

// Highest amount of dice with the same value
const cloneMax = () => {
    let cloneCount = 1;

    for (const amount of multiples.counts) {
        if (amount.count > cloneCount) {
            cloneCount = amount.count;
        }
    }

    return cloneCount;
};

const multiYahtzee = () => {
    if (arrayEntry(scoreLower.scores, 'id', 'yahtzee').final === 50 && cloneMax() === 5) {
        return true;
    }

    return false;
};

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (cloneMax() === 3) {
        for (const amount of multiples.counts) {
            if (amount.count == 2) {
                return true;
            }
        }
    }

    return multiYahtzee();
};

// Check whether 4 or 5 consecutive numeric values can be found among the thrown dice
const consecutive = () => {
    let consec = 0;

    // Start from a lowest value
    for (let index = 1; index < 4; ++index) {
        let mult = arrayEntry(scoreUpper.scores, 'id', index).scored;

        // When there is a vaule found, start multiplying
        if (mult > 0) {
            let streak = 1;

            // Keep multiplying
            for (let jndex = index + 1; jndex <= valueMax; ++jndex) {
                mult *= arrayEntry(scoreUpper.scores, 'id', jndex).scored;

                // Check multiplication value.
                if (mult > 0) {
                    ++streak;

                    if (streak === 4) {
                        consec = 4;
                    }

                    if (streak === 5) {
                        return 5;
                    }
                }
            }
        }
    }

    if (multiYahtzee()) {
        consec = 5;
    }

    return consec;
};

const countLower = () => {
    const sameResult = cloneMax();
    const straight = consecutive();

    arrayEntry(scoreLower.scores, 'id', 'yahtzee').scored = sameResult === 5 ? 50 : 0;

    arrayEntry(scoreLower.scores, 'id', 'four').scored = sameResult >= 4 ? diceSum.value : 0;

    arrayEntry(scoreLower.scores, 'id', 'three').scored = sameResult >= 3 ? diceSum.value : 0;

    arrayEntry(scoreLower.scores, 'id', 'full').scored = filledHouse() ? 25 : 0;

    arrayEntry(scoreLower.scores, 'id', 'small').scored = straight > 3 ? 30 : 0;

    arrayEntry(scoreLower.scores, 'id', 'large').scored = straight > 4 ? 40 : 0;

    arrayEntry(scoreLower.scores, 'id', 'chance').scored = diceSum.value;
};

const recount = () => {
    countMultiples();
    countUpper();
    sumUpper();
    countLower();
};

recount();

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === open && typeof score.scored === 'number') {
        score.final = score.scored;
        score.locked = lock;

        if (multiYahtzee()) {
            ++extraYahtzee.value;
        }

        diceReroll();

        recount();
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

const rounded = fract => {
    return Math.round(fract);
};
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
            </tr>
        </table>
    </div>

    <div class="inlined">
        <table>
            <tr>
                <th>Getal</th>
                <th>Aantal</th>
            </tr>
            <tr v-for="amount in multiples.counts" :key="amount.id">
                <td>{{ amount.id }}</td>
                <td>{{ amount.count }}</td>
            </tr>
        </table>
    </div>

    <br />
    <br />
    <div></div>
</template>
