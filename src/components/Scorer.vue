<script setup>
import {reactive} from 'vue';
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

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }
};

const scoreArray = reactive({
    scores: [
        {id: 'enen', scored: 0},
        {id: 'tweeën', scored: 0},
        {id: 'drieën', scored: 0},
        {id: 'vieren', scored: 0},
        {id: 'vijfen', scored: 0},
        {id: 'zessen', scored: 0},
    ],
});

const berekeningen = () => {};
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
</template>
