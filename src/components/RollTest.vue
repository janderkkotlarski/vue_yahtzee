<script setup>
import {ref, reactive, computed, watch} from 'vue';
import Dice from './Dice.vue';

// const props = defineProps(['rolls']);

const emit = defineEmits(['inFocus', 'rescan']);

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const numberLine = 0;

// const diceReroll = () => {
//     for (const cube of diceLine.value.dice) {
//         cube.rolled = roll();
//     }
// };

// const rollDice = () => {
//     for (const cube of diceLine.value.dice) {
//         cube.rolled = numberLine;
//     }
// };

const diceReroll = () => {
    const dices = [];

    for (let index = 1; index <= diceAmount; ++index) {
        let eyes = roll();

        if (numberLine >= 1 && numberLine <= valueMax) {
            eyes = numberLine;
        }

        dices.push({id: index, rolled: eyes});
    }

    return dices;
};

const diceRolls = diceReroll();

const diceLine = defineModel('diceLine');

const runs = ref(0);

// A way of initializing that what needs outside initialization without needing that
const initDiceRolls = () => {
    if (diceLine.value === undefined) {
        diceLine.value = diceRolls;
    }
};

initDiceRolls();

watch(diceLine, initDiceRolls);

// const rolling = () => {
//     if (numberLine >= 1 && numberLine <= valueMax) {
//         diceReroll();
//     } else {
//         rollDice();
//     }
// };

// const diceLine = defineModel('diceLine', {type: Object, default: {dice: []}});

// rolling();

// defineExpose({
//     rolling,
// });

// const rolling = computed(() => {
//     for (const cube of diceLine.value.dice) {
//         cube.rolled = numberLine >= 1 && numberLine <= valueMax ? numberLine : roll();
//     }
// });

// const diceLine = ref({
//     dice: [],
// });

// const diceArrayFilling = () => {
//     for (let index = 1; index <= diceAmount; ++index) {
//         diceLine.value.dice.push({id: index, rolled: index});
//     }
// };

// diceArrayFilling();

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
};

// @click="uptick(cube.id)"

// <div>
//         <Dice
//             v-for="cube in diceLine.dice"
//             :key="cube.id"
//             v-model:eyeValue="cube.rolled"
//             :class="normal"
//             :inverted="normal"
//         />
//     </div>
</script>

<template>
    {{ runs }}
    <br />
    {{ diceLine }}
</template>
