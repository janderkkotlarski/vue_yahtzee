<script setup>
import {ref} from 'vue';
import Divider from './VerticalDivider.vue';
import Dice from './DiceLines.vue';

// Simple constants
// 6 sided dice
const valueMax = 6;
// 5 dice
const diceAmount = 5;

// Had numberLine as an imported value, worked wonky at times
// Simplify where possible
// Depending on the value, different kinds of dice values can be rolled
const numberLine = 6;
// For testing purposes
const currentNumber = ref(0);

// How many times are the dice rolled for viewing pleasure
const maxThrows = 25;
// HOw long does a roll last?
const millis = 25;
// The maximum amount of (re)rolling the dice for a round
const maxClicks = 3;
// How many (re)rolls left for the current round
const clicked = ref(maxClicks);

// Status classes for the shown dice
const normal = '______';
const invert = 'invert';
const starts = 'starts';

// Only rolled designates active rolling
const stilled = 'stilled';
const rolled = 'rolled';

// Button messages
const buttonMessage = 'Gooien: ';
const buttonStoppage = 'Klik hieronder';

// Parent input on deciding which button is visible
defineProps({
    buttonVisible: {type: Boolean, default: true},
});

// defineEmits to let the parent do the recount and resetMultiples functions upon emission
const emit = defineEmits(['recounting', 'resetMultiples']);

// The dice roll array from the parent, and here the actual rolling happens
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

    // When valueMax is yahtzee roll value
    if (numberLine === valueMax) {
        // Prep for max scoring
        currentNumber.value = valueMax;
    }
};

diceArrayFilling();

// Feels a bit like passing parameters by reference in C++
// Got rid of the superfluous index restrictions
const cuboid = index => {
    return diceLine.value.dice[index - 1];
};

// The dice are not automatically thrown
const throwing = ref(stilled);

// When the first throw is performed, make all dice normally rollable
const normalDicing = () => {
    // Only for the start of hte round
    if (clicked.value === maxClicks) {
        for (let index = 1; index <= diceAmount; ++index) {
            if (cuboid(index).inversion === starts) {
                cuboid(index).inversion = normal;
            }
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

                // If currentNumber is a rollable number that is not valueMax, then roll that as a yahtzee
                if (currentNumber.value > 0 && currentNumber.value < valueMax) {
                    cuboid(index).rolled = currentNumber.value;
                }
            }

            // If numberLine is higher than valueMax, just roll randomly
            if (numberLine > valueMax || throwing.value === rolled) {
                cuboid(index).rolled = roll();
            }
        }
    }
};

// Let's the parent decrease currentNumber by 1
const lowerCurrentNumber = () => {
    --currentNumber.value;
};

// Throw dice a number of times and space them apart in time
const diceRolling = () => {
    if (throwing.value === stilled) {
        throwing.value = rolled;

        normalDicing();

        --clicked.value;

        for (let throws = 0; throws < maxThrows; ++throws) {
            setTimeout(function () {
                diceRoll();
            }, millis * throws);
        }

        // Pace throwing
        setTimeout(function () {
            throwing.value = stilled;

            diceRoll();

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
