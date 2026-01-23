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

    countAll();
};

const scoreArray = reactive({
    scores: [
        {id: 1, scored: 0},
        {id: 2, scored: 0},
        {id: 3, scored: 0},
        {id: 4, scored: 0},
        {id: 5, scored: 0},
        {id: 6, scored: 0},
        {id: 'summed', scored: 0},
        {id: 'bonus', scored: 0},
        {id: 'upper', scored: 0},
        {id: 'three', scored: 0},
        {id: 'four', scored: 0},
        {id: 'full', scored: 0},
        {id: 'small', scored: 0},
        {id: 'large', scored: 0},
        {id: 'yahtzee', scored: 0},
        {id: 'chance', scored: 0},
        {id: 'yonus', scored: 0},
        {id: 'lower', scored: 0},
        {id: 'total', scored: 0},
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

const countAll = () => {
    let summed = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const score = countNumber(number) * number;

        arrayEntry(scoreArray.scores, 'id', number).scored = score;
        summed += score;
    }

    const bonus = summed >= 10 ? 35 : 0;

    arrayEntry(scoreArray.scores, 'id', 'summed').scored = summed;
    arrayEntry(scoreArray.scores, 'id', 'bonus').scored = bonus;
    arrayEntry(scoreArray.scores, 'id', 'upper').scored = summed + bonus;
};

countAll();
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

    <table>
        <tr>
            <th>Combinatie</th>
            <th>Punten</th>
        </tr>
        <tr v-for="score in scoreArray.scores" :key="score.id">
            <td>{{ score.id }}</td>
            <td>{{ score.scored }}</td>
        </tr>
    </table>

    <br />
    <br />
    <div></div>
</template>
