<script setup>
import {ref} from 'vue';

defineProps({
    // moarYahtzee: {type: Boolean, default: false},
});

const diceAmount = 5;
const valueMax = 6;

const multiples = defineModel('multiples', {
    type: Object,
    default: {
        return: {counts: []},
    },
});

const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
    },
});

// const yahtzeeChevron = defineModel('yahtzeeChevron', {
//     type: Number,
//     default: 0,
// });

// const multiples = ref({counts: []});

const initMultiples = () => {
    for (let number = 1; number <= valueMax; ++number) {
        multiples.value.counts.push({id: number, count: 0});
    }
};

initMultiples();

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceLine.value.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

const yahtzeeChevron = ref(0);

let sameMax = 0;

const countMultiples = () => {
    // sameMax = 0;
    // yahtzeeChevron.value = 0;

    let number = 1;
    // let yahtzee = false;

    for (const amount of multiples.value.counts) {
        amount.count = 2; //countNumber(number);

        // if (sameMax < amount.count) {
        //     sameMax = amount.count;
        // }

        // // yahtzee needed so yahtzeeChevron does not go to 6 when index gets upped
        // if (sameMax === diceAmount && !yahtzee) {
        //     yahtzeeChevron.value = index;

        //     yahtzee = true;
        // }
    }
};

// countMultiples();

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax === 3) {
        for (const amount of multiples.value.counts) {
            if (amount.count === 2) {
                return true;
            }
        }
    }

    return moarYahtzee;
};

// Check whether 4 or 5 consecutive numeric values can be found among the thrown dice
const consecutive = () => {
    let consec = 0;
    let counted = 0;

    for (const amount of multiples.value.counts) {
        counted = amount.count ? counted + 1 : 0;

        if (counted > consec) {
            consec = counted;
        }
    }

    if (moarYahtzee) {
        consec = 5;
    }

    return consec;
};

defineExpose({
    countMultiples,
});

/*
<div>diceLine: {{ diceLine }}</div>

    <div>yahtzeeChevron: {{ yahtzeeChevron }}</div>

*/
</script>

<template>
    <div>yahtzeeChevron: {{ yahtzeeChevron }}</div>

    <div>multiples: {{ multiples }}</div>

    <div>diceLine: {{ diceLine }}</div>
</template>
