<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;

const normal = '______';
const invert = 'invert';

const total = ref(0);

// reactive() for arrays and simpler handling
const diceValues = reactive([]);

const diceRolls = defineModel('diceRolls', {type: Array, default: []});

// reactive() objects can just be passed along like variables
const reactArrayIndex = (reactName, index, amount) => {
    // Check whether generating or changing array contents
    if (index === reactName.length + 1) {
        // Generate new array contents
        reactName.push({id: index, entry: amount, inversion: normal});
        // reactName.push({id: index + 1, entry: 0});
    } else if (index > 0 && index < reactName.length + 1 && reactName[index - 1].inversion === normal) {
        // Change specific array content
        reactName[index - 1].entry = amount;
    }
};

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

const flip = index => {
    if (index > 0 && index < diceRolls.value.length + 1) {
        let flipped = diceRolls.value[index - 1].inversion;
        // Change specific array content
        if (flipped === invert) {
            flipped = normal;
        } else {
            flipped = invert;
        }

        diceRolls.value[index - 1].inversion = flipped;
    }
};

const resum = () => {
    total.value = 0;

    for (let index = 1; index <= diceAmount; ++index) {
        total.value += diceRolls.value[index - 1].entry;
    }
};

// Roll all dice, then update results
const rolling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        reactArrayIndex(diceRolls.value, index, roll());
    }

    resum();
};

// Roll the dice
rolling();
</script>

<template>
    <div>
        <Dice
            @click="flip(rolled.id)"
            v-for="rolled in diceRolls"
            :key="rolled.id"
            v-model:value="rolled.entry"
            :class="rolled.inversion"
            :inverted="rolled.inversion"
        />
    </div>

    {{ diceRolls }}

    <br />
    <button @click="rolling">Opnieuw rollen?</button>
    <br />
    <div>
        {{ total }}
    </div>
    <br />
</template>
