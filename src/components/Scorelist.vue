<script setup>
// import {ref} from 'vue';

// Make sure that every entry is intelligible for the compiler, so do recreate variables when needed
const klik = 'klik';
const back = 'back';

const initUpper = () => {
    return {
        scores: [
            {id: 1, title: 'Enen', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 2, title: 'Tweeën', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 3, title: 'Drieën', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 4, title: 'Vieren', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 5, title: 'Vijfen', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 6, title: 'Zessen', scored: 0, final: 0, yonus: 'null', locked: klik},
            {id: 'summed', title: 'Getallen', scored: ' ', final: 0, yonus: 'never', locked: back},
            {id: 'bonus', title: 'Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
            {id: 'upper', title: 'Boven Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
        ],
    };
};

const listing = defineModel('listing', {type: Array, default: []});

const yahtzeeStuff = defineModel('yahtzeeStuff', {
    type: Array,
    default: {
        moreYahtzee: false,
        extraYahtzee: 0,
        indexYahtzee: 0,
    },
});

const furtherYahtzee = defineModel('furtherYahtzee', {type: Boolean, default: false});

const indexYahtzee = defineModel('indexYahtzee');

const plusYahtzee = defineModel('plusYahtzee', {type: Number, default: 0});

// listing.value = initUpper();

const scoress = list => {
    return list.value.scores;
};

const arrayEntry = (array, key, content) => {
    for (const entry of array.value) {
        if (entry[key] === content) {
            return entry;
        }
    }
};

const lockEntry = index => {
    const score = arrayEntry(scoress(listing), 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        // If another yahtzee is scored, restrict scoring to official multiple yahtzee bonus scoring rules

        if (furtherYahtzee ? yahtzeeClicking(index) : true) {
            // When another yahtzee is scored, up the bonus
            if (furtherYahtzee) {
                ++plusYahtzee.value;
            }

            score.final = score.scored;
            score.locked = lock;

            rolling(number);
            recount();
        }
    }
};

const kliksplay = locked => {
    if (locked === klik) {
        return klik;
    }

    return ' ';
};
</script>

<template>
    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
                <th>Klikbaar</th>
            </tr>
            <tr @click="lockEntry(score.id)" v-for="score in listing.scores" :key="score.id" :class="score.locked">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td>{{ kliksplay(score.locked) }}</td>
            </tr>
        </table>
    </div>
</template>
