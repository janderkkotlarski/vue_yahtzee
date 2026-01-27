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

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.dice[index - 1];
    }
};
const calculations = () => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceArray.dice[index].rolled === 1) {
            ++count;
        }
    }

    return count;
};

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }

    countUpper();
};

const scoreArray = reactive({
    scores: [
        {id: 1, title: 'Enen', scored: 0},
        {id: 2, title: 'Tweeën', scored: 0},
        {id: 3, title: 'Drieën', scored: 0},
        {id: 4, title: 'Vieren', scored: 0},
        {id: 5, title: 'Vijfen', scored: 0},
        {id: 6, title: 'Zessen', scored: 0},
        {id: 'summed', title: 'Getallen', scored: 0},
        {id: 'bonus', title: 'Bonus', scored: 0},
        {id: 'upper', title: 'Boven Totaal', scored: 0},
        {id: 'three', title: '3 Gelijke', scored: 0},
        {id: 'four', title: '4 Gelijke', scored: 0},
        {id: 'full', title: 'Full House', scored: 0},
        {id: 'small', title: 'Kleine Straat', scored: 0},
        {id: 'large', title: 'Grote Straat', scored: 0},
        {id: 'chance', title: 'Kans', scored: 0},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: 0},
        {id: 'lower', title: 'Lager Totaal', scored: 0},
        {id: 'total', title: 'Geheel Totaal', scored: 0},
    ],
});

const scoreUpper = reactive({
    scores: [
        {id: 1, title: 'Enen', scored: 0},
        {id: 2, title: 'Tweeën', scored: 0},
        {id: 3, title: 'Drieën', scored: 0},
        {id: 4, title: 'Vieren', scored: 0},
        {id: 5, title: 'Vijfen', scored: 0},
        {id: 6, title: 'Zessen', scored: 0},
        {id: 'summed', title: 'Getallen', scored: 0},
        {id: 'bonus', title: 'Bonus', scored: 0},
        {id: 'upper', title: 'Boven Totaal', scored: 0},
    ],
});

const scoreLower = reactive({
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0},
        {id: 'four', title: '4 Gelijke', scored: 0},
        {id: 'full', title: 'Full House', scored: 0},
        {id: 'small', title: 'Kleine Straat', scored: 0},
        {id: 'large', title: 'Grote Straat', scored: 0},
        {id: 'chance', title: 'Kans', scored: 0},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: 0},
        {id: 'lower', title: 'Lager Totaal', scored: 0},
        {id: 'total', title: 'Geheel Totaal', scored: 0},
    ],
});

const arrayEntry = (array, key, value) => {
    for (const entry of array) {
        if (entry[key] === value) {
            return entry;
        }
    }
};

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceArray.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

const countMultiples = () => {
    const amounts = [];

    for (let index = 0; index < 3; ++index) {
        amounts.push(0);
    }

    const counts = [];

    for (let index = 1; index <= valueMax; ++index) {
        counts.push(countNumber(index));
    }
};

const countUpper = () => {
    let summed = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const score = countNumber(number) * number;

        arrayEntry(scoreUpper.scores, 'id', number).scored = score;
        summed += score;
    }

    const bonus = summed >= 10 ? 35 : 0;

    arrayEntry(scoreUpper.scores, 'id', 'summed').scored = summed;
    arrayEntry(scoreUpper.scores, 'id', 'bonus').scored = bonus;
    arrayEntry(scoreUpper.scores, 'id', 'upper').scored = summed + bonus;
};

countUpper();
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
            </tr>
            <tr v-for="score in scoreUpper.scores" :key="score.id">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
            </tr>
        </table>
    </div>

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
            </tr>
            <tr v-for="score in scoreLower.scores" :key="score.id">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
            </tr>
        </table>
    </div>

    <br />
    <br />
    <div></div>
</template>
