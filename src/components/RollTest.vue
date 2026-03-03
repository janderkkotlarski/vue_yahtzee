<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

const emit = defineEmits(['inFocus', 'rescan']);

const diceLine = defineModel('diceLine', {type: Object, default: {dice: []}});

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const diceReroll = () => {
    for (const cube of diceLine.value.dice) {
        cube.rolled = roll();
    }
};

const rollYahtzee = number => {
    for (const cube of diceLine.value.dice) {
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

// const diceLine = ref({
//     dice: [],
// });

// const diceArrayFilling = () => {
//     for (let index = 1; index <= diceAmount; ++index) {
//         diceLine.value.dice.push({id: index, rolled: index});
//     }
// };

// diceArrayFilling();

/*

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const diceReroll = () => {
    for (const cube of diceLine.value.dice) {
        cube.rolled = roll();
    }
};

const rollYahtzee = number => {
    for (const cube of diceLine.value.dice) {
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
        return diceLine.value.dice[index - 1];
    }
};

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceLine.value.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

let diceSum = 0;

const summing = () => {
    diceSum = 0;

    for (const cube of diceLine.value.dice) {
        diceSum += cube.rolled;
    }
};

*/

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceLine.value.dice[index - 1];
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

    emit('rescan');

    // recount();
};

let indexer = 0;

const upwick = () => {
    ++indexer;

    // if (index > 0 && index <= diceAmount) {
    //     // const cubid = diceLine.value.dice[index - 1];

    //     indexer = index;

    //     // if (diceLine.dice[index - 1].rolled > valueMax) {
    //     //     diceLine.dice[index - 1].rolled -= valueMax;
    //     // }
    // }
};

//
</script>

<template>
    <div>
        <Dice
            @click="uptick(cube.id)"
            v-for="cube in diceLine.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="normal"
            :inverted="normal"
        />
    </div>

    {{ indexer }}
</template>
