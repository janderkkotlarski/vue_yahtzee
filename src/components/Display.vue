<script setup>
import {reactive} from 'vue';
import Dice from './Dice.vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;

// reactive() for arrays and simpler handling
const diceValues = reactive([]);
// const valueCounts = reactive([]);

// reactive() objects can just be passed along like variables
const reactArrayIndex = (reactName, index, amount) => {
    // Check whether generating or changing array contents
    if (index === reactName.length + 1) {
        // Generate new array contents
        reactName.push({id: index, entry: amount, rolls: true});
        // reactName.push({id: index + 1, entry: 0});
    } else if (index > 0 && index < reactName.length + 1) {
        // Change specific array content
        reactName[index - 1].entry = amount;
    }
};

// Simple dice roll function
const roll = () => Math.floor(valueMax * Math.random()) + 1;

// Reroll a specific die, then update results
const reroll = index => {
    reactArrayIndex(diceValues, index, roll());

    if (index > 0 && index < reactName.length + 1) {
        // Change specific array content
        reactName[index - 1].rolls = !reactName[index - 1].rolls;
    }
    // valueCounting();
};

// Roll all dice, then update results
const rolling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        reactArrayIndex(diceValues, index, roll());
    }

    // valueCounting();
};
/*
// For each result count the number of dice showing that result
const valueCounting = () => {
    // For each value...
    for (let index = 0; index < valueMax; ++index) {
        let count = 0;

        //...count the number of dice displaying that value
        for (let jndex = 0; jndex < diceAmount; ++jndex) {
            if (diceValues[jndex].entry === index + 1) {
                ++count;
            }
        }

        // Put that number in the correct place
        reactArrayIndex(valueCounts, index, count);
    }
};

 <table>
        <thead>
            <tr>
                <th>Waarde</th>
                <th>Hoeveelheid</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="value in valueCounts" :key="value.id">
                <td>{{ value.id }}</td>
                <td>{{ value.entry }}</td>
            </tr>
        </tbody>
    </table>

*/

// Roll the dice
rolling();
</script>

<template>
    <div>
        <Dice @click="reroll(value.id)" v-for="value in diceValues" :key="value.id" v-model:value="value.entry">
            value.entry
        </Dice>
    </div>

    <br />
    <button @click="rolling">Opnieuw rollen?</button>
    <br />

    <br />
</template>
