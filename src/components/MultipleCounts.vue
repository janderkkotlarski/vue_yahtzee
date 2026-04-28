<script setup>
import {ref} from 'vue';

const valueMax = 6;
const diceAmount = 5;

// defineProps does not work without <template></template>
// Also does not update in <script setup></setup> functions
// The maximum amount of rolled results
const sameMax = ref(0);

// Because the defineModel does not update when addressed in parent functions but later
// A ref and defineExpose and explicitly updating moarYahtzee works as intended
// Keeps track of more yahtzee rolls when a yahtzee has been successfully scored
const moarYahtzee = ref(0);

// Keeping track for all possible dice roll results how many there have been rolled
const multiples = defineModel('multiples', {
    type: Object,
    default: {
        return: {counts: []},
    },
});

// The actual dice roll array
const diceLine = defineModel('diceLine', {
    type: Object,
    default: {
        dice: [],
    },
});

// Initialization
const initMultiples = () => {
    for (let number = 1; number <= valueMax; ++number) {
        multiples.value.counts.push({id: number, count: 0});
    }
};

initMultiples();

// For a certain result count the amount of dice having rolled that number
const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceLine.value.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

// Get all the actual rolled number amounts
// And keep track of some other important values
const countMultiples = () => {
    sameMax.value = 0;
    // Records for which rolled value a yahtzee is scored
    let yahtzeeChevron = 0;

    // Potentially rolled results
    let number = 1;

    for (const amount of multiples.value.counts) {
        // Check for number the amount of rolled results
        amount.count = countNumber(number);

        // sameMax is the maximum rolled results
        if (sameMax.value < amount.count) {
            sameMax.value = amount.count;
        }

        // If sameMax reaches yahtzee, then record the number for which this happens
        if (sameMax.value === diceAmount && yahtzeeChevron === 0) {
            yahtzeeChevron = number;
        }

        ++number;
    }

    return yahtzeeChevron;
};

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    // If the max of same results is 3
    if (sameMax.value === 3) {
        for (const amount of multiples.value.counts) {
            // Then check whether there is 2 of a different same results
            if (amount.count === 2) {
                return 1;
            }
        }
    }

    // If there is another yahtzee, then that also counts
    // The -1 value is for clarity and handy testing purposes
    return moarYahtzee.value;
};

// Check whether 4 or 5 consecutive numeric values can be found among the thrown dice
const consecutive = () => {
    let consec = 0;
    let counted = 0;

    for (const amount of multiples.value.counts) {
        // If there is any rolled result then add 1 to counted
        // Else reset to 0
        counted = amount.count ? counted + 1 : 0;

        // consec is always the maximum of counted
        if (counted > consec) {
            consec = counted;
        }
    }

    // If there is another yahtzee, then consec is set to its most possible maximum
    if (moarYahtzee.value === 1) {
        consec = 5;
    }

    return consec;
};

// Functions and variables 'revealed' to the parent component
defineExpose({
    countMultiples,
    filledHouse,
    consecutive,
    moarYahtzee,
    sameMax,
});

// No <template></template> necessary
</script>
