<script setup>
import {ref} from 'vue';

// Simple constants
const valueMax = 6;
const diceAmount = 5;

// defineProps does not work without <template></template>
// Also does not update in <script setup></setup> functions
const sameMax = ref(0);

// Because the defineModel does not update when addressed in parent functions but later
// A ref and defineExpose and explicitly updating moarYahtzee works as intended
const moarYahtzee = ref(0);

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

const countMultiples = () => {
    sameMax.value = 0;
    let yahtzeeChevron = 0;

    let number = 1;
    let yahtzee = false;

    for (const amount of multiples.value.counts) {
        amount.count = countNumber(number);

        if (sameMax.value < amount.count) {
            sameMax.value = amount.count;
        }

        // yahtzee needed so yahtzeeChevron does not go to 6 when index gets upped
        if (sameMax.value === diceAmount && !yahtzee) {
            yahtzeeChevron = number;

            yahtzee = true;
        }

        ++number;
    }

    return yahtzeeChevron;
};

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax.value === 3) {
        for (const amount of multiples.value.counts) {
            if (amount.count === 2) {
                return 1;
            }
        }
    }

    return moarYahtzee.value;
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

    if (moarYahtzee.value === -1) {
        consec = 5;
    }

    return consec;
};

defineExpose({
    countMultiples,
    filledHouse,
    consecutive,
    moarYahtzee,
    sameMax,
});
</script>
