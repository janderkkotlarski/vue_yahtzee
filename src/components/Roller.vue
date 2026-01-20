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
const diceInversions = reactive([]);

// const diceTrolls = defineModel('diceTrolls', {type: Array, default: []});
const diceRolls = defineModel('diceRolls', {type: Array, default: []});

// const diceRolls = ref([]);

// reactive() objects can just be passed along like variables
const reactArrayIndex = (reactName, index, content) => {
    // Check whether generating or changing array contents
    if (index === reactName.length + 1) {
        // Generate new array contents
        reactName.push({id: index, entry: content});
        // reactName.push({id: index + 1, entry: 0});
    } else if (index > 0 && index < reactName.length + 1) {
        // Change specific array content
        reactName[index - 1].entry = content;
    }
};

const normalization = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        reactArrayIndex(diceInversions, index, normal);
    }
};

// const reactArrayInvert = (reactName, index) => {
//     if (index > 0 && index < reactName.length + 1) {
//         let flipped = reactName[index - 1].inversion;

//         if (flipped === invert) {
//             flipped = normal;
//         } else {
//             flipped = invert;
//         }

//         reactName[index - 1].inversion = flipped;
//     }
// };

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// const flip = index => {
//     reactArrayInvert(diceRolls.value, index);
// };

const single = index => {
    reactArrayIndex(diceRolls.value, index, roll());
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
normalization();
rolling();
</script>

<template>
    <div>
        <Dice
            @click="single(rolled.id)"
            v-for="rolled in diceRolls"
            :key="rolled.id"
            v-model:eyeValue="rolled.entry"
            :class="normal"
            :inverted="normal"
        />
    </div>

    {{ diceRolls }}
    {{ diceInversions }}

    <br />
    <button @click="rolling">Opnieuw rollen?</button>
    <br />
    <div>
        {{ total }}
    </div>
    <br />
</template>
