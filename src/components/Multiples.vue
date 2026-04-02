<script setup>
// const multiples = ref({
//     counts: [],
// });

const props = defineProps({
    diceLine: {
        type: Object,
        default: {
            dice: [],
            clicked: 0,
        },
    },
    moarYahtzee: {type: Boolean, default: false},
});

const valueMax = 6;

const multiples = defineModel('multiples', {
    type: Object,
    default: {
        counts: [],
    },
});

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
</script>
