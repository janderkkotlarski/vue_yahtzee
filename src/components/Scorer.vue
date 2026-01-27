<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

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
        {id: 1, title: 'Enen', scored: 0, locked: 0},
        {id: 2, title: 'Tweeën', scored: 0, locked: 0},
        {id: 3, title: 'Drieën', scored: 0, locked: 0},
        {id: 4, title: 'Vieren', scored: 0, locked: 0},
        {id: 5, title: 'Vijfen', scored: 0, locked: 0},
        {id: 6, title: 'Zessen', scored: 0, locked: 0},
        {id: 'summed', title: 'Getallen', scored: ' ', locked: 0},
        {id: 'bonus', title: 'Bonus', scored: ' ', locked: 0},
        {id: 'upper', title: 'Boven Totaal', scored: ' ', locked: 0},
    ],
});

const scoreLower = reactive({
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0, locked: 0},
        {id: 'four', title: '4 Gelijke', scored: 0, locked: 0},
        {id: 'full', title: 'Full House', scored: 0, locked: 0},
        {id: 'small', title: 'Kleine Straat', scored: 0, locked: 0},
        {id: 'large', title: 'Grote Straat', scored: 0, locked: 0},
        {id: 'chance', title: 'Kans', scored: 0, locked: 0},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0, locked: 0},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: ' ', locked: 0},
        {id: 'lower', title: 'Lager Totaal', scored: ' ', locked: 0},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', locked: 0},
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

countMultiples();

const diceSum = ref(0);

const countUpper = () => {
    diceSum.value = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const score = arrayEntry(multiples.counts, 'id', number).count * number;

        arrayEntry(scoreUpper.scores, 'id', number).scored = score;
        diceSum.value += score;
    }
};

countUpper();

const cloneMax = () => {
    let cloneCount = 1;

    for (const amount of multiples.counts) {
        if (amount.count > cloneCount) {
            cloneCount = amount.count;
        }
    }

    return cloneCount;
};

const countLower = () => {
    const sameResult = cloneMax();

    if (sameResult === 5) {
        arrayEntry(scoreLower.scores, 'id', 'yahtzee').scored = 50;
    }

    if (sameResult >= 4) {
        arrayEntry(scoreLower.scores, 'id', 'four').scored = diceSum.value;
    }

    if (sameResult >= 3) {
        arrayEntry(scoreLower.scores, 'id', 'three').scored = diceSum.value;
    }

    arrayEntry(scoreLower.scores, 'id', 'chance').scored = diceSum.value;
};

countLower();

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }

    countMultiples();

    countUpper();

    countLower();
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
            <tr v-for="score in scoreUpper.scores" :key="score.id">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
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
            <tr v-for="score in scoreLower.scores" :key="score.id">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.locked }}</td>
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
