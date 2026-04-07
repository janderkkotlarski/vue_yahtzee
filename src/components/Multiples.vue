<script setup>
import {ref} from 'vue';

const props = defineProps({
    diceLine: {
        type: Object,
        default: {
            dice: [],
        },
    },
    // moarYahtzee: {type: Boolean, default: false},
});

const valueMax = 6;

// const multiples = defineModel('multiples', {
//     type: Object,
//     default: {
//         counts: [],
//     },
// });

// const yahtzeeChevron = defineModel('yahtzeeChevron', {
//     type: Number,
//     default: 0,
// });

const multiples = ref({counts: []});

const initMultiples = () => {
    for (let index = 1; index <= valueMax; ++index) {
        multiples.value.counts.push({id: index, count: 0});
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
    sameMax = 0;
    yahtzeeChevron.value = 0;

    let index = 1;
    let yahtzee = false;

    // for (const amount of multiples.value.counts) {
    //     amount.count = 8; // countNumber(index);

    //     if (sameMax < amount.count) {
    //         sameMax = amount.count;
    //     }

    //     // yahtzee needed so yahtzeeChevron does not go to 6 when index gets upped
    //     if (sameMax === diceAmount && !yahtzee) {
    //         yahtzeeChevron.value = index;

    //         yahtzee = true;
    //     }

    //     ++index;
    // }
};

countMultiples();

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax === 3) {
        for (const amount of multiples.value.counts) {
            if (amount.count == 2) {
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

// defineExpose({
//     countMultiples,
// });

/*
<div>diceLine: {{ diceLine }}</div>

    <div>yahtzeeChevron: {{ yahtzeeChevron }}</div>

*/
</script>

<template>
    <div>yahtzeeChevron: {{ yahtzeeChevron }}</div>

    <div>multiples: {{ multiples }}</div>
</template>
