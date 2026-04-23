<script setup>
import {ref} from 'vue';
import Divider from './VerticalDivider.vue';
import Dice from './DiceLines.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;

// Had numberLine as an imported value, worked wonky at times
// Simplify where possible
const numberLine = 6;
const currentNumber = ref(0);
const maxThrows = 25;
const millis = 25;
const maxClicks = 3;
const clicked = ref(maxClicks);

const normal = '______';
const invert = 'invert';
const starts = 'starts';

const stilled = 'stilled';
const rolled = 'rolled';

const buttonMessage = 'Gooien: ';
const buttonStoppage = 'Klik hieronder';

// Parent input on deciding which button is visible
defineProps({
    buttonVisible: {type: Boolean, default: true},
});

/// defineEmits to let the parent do the recount and resetMultiples functions upon emission
const emit = defineEmits(['recounting', 'resetMultiples']);

// The array of dice from the parent, but n this child component the rolling happens
const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
    },
});

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// Fill the dice array in the diceArray object with sensible entries
// Do the same for the publicDice defineModel object
const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceLine.value.dice.push({id: index, rolled: 0, inversion: starts});
    }

    if (numberLine === valueMax) {
        currentNumber.value = valueMax;
    }
};

diceArrayFilling();

// Feels a bit like passing parameters by reference in C++
// Got rid of the superfluous index restriction
const cuboid = index => {
    return diceLine.value.dice[index - 1];
};

const throwing = ref(stilled);

// When the first throw is performed, make all dice normally rollable
const normalDicing = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        if (cuboid(index).inversion === starts) {
            cuboid(index).inversion = normal;
        }
    }
};

// Roll all dice that are rollable
const diceRoll = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        // If not locked, then roll
        if (cuboid(index).inversion != invert) {
            // Standard is empty die
            cuboid(index).rolled = 0;

            // For numberLine is 0 or -1 make a big straight
            if (numberLine > -2) {
                cuboid(index).rolled = index - numberLine;
            }

            // If numberLine is any dice value, roll yahtzee with that dice value
            if (numberLine > 0 && numberLine <= valueMax) {
                cuboid(index).rolled = numberLine;

                if (currentNumber.value > 0 && currentNumber.value < valueMax) {
                    cuboid(index).rolled = currentNumber.value;
                }
            }

            // If numberLine is too big, just roll randomly
            if (numberLine > valueMax) {
                cuboid(index).rolled = roll();
            }
        }
    }
};

const lowerCurrentNumber = () => {
    --currentNumber.value;
};

// Throw dice a number of times and space them apart in time
const diceRolling = () => {
    if (throwing.value === stilled) {
        throwing.value = rolled;

        --clicked.value;

        normalDicing();

        for (let throws = 0; throws < maxThrows; ++throws) {
            setTimeout(function () {
                diceRoll();
            }, millis * throws);
        }

        // Pace throwing
        setTimeout(function () {
            throwing.value = stilled;

            emit('recounting');
        }, millis * maxThrows);
    }
};

// For the next round
const diceArrayReset = () => {
    if (throwing.value === stilled) {
        for (let index = 1; index <= diceAmount; ++index) {
            cuboid(index).rolled = 0;
            cuboid(index).inversion = starts;
        }

        clicked.value = maxClicks;

        emit('resetMultiples');
    }
};

// flip between free and locked
const flip = index => {
    // Once one cannot roll, flipping the roll/hold state is useless
    if (clicked.value > 0 && clicked.value < maxClicks && throwing.value === stilled) {
        cuboid(index).inversion = cuboid(index).inversion === normal ? invert : normal;
    }
};

const restart = () => {
    location.reload();
};

// Give function access to the parent
defineExpose({
    lowerCurrentNumber,
    diceArrayReset,
    currentNumber,
});
</script>

<template>
    <div>
        <Dice
            @click="flip(cube.id)"
            v-for="cube in diceLine.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="cube.inversion"
            :inverted="cube.inversion"
        />
    </div>

    <Divider />

    <button v-if="buttonVisible && clicked > 0" class="switch" :class="throwing" @click="diceRolling">
        {{ buttonMessage }} {{ clicked }}
    </button>
    <button v-if="clicked === 0" class="switch invert">{{ buttonStoppage }}</button>

    <button v-if="!buttonVisible" class="switch" @click="restart">Herstart</button>
</template>
