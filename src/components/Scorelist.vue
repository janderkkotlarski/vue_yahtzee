<script setup>
import {ref} from 'vue';

// Make sure that every entry is intelligible for the compiler, so do recreate variables when needed
const klik = 'klik';
const back = 'back';

const initUpper = () => {
    return [
        {id: 1, title: 'Enen', scored: 0, final: 9001, yonus: 'null', locked: klik},
        {id: 2, title: 'Tweeën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 3, title: 'Drieën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 4, title: 'Vieren', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 5, title: 'Vijfen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 6, title: 'Zessen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'summed', title: 'Getallen', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'bonus', title: 'Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'upper', title: 'Boven Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ];
};

const listing = defineModel('listing', {type: Array, default: []});

const arrayEntry = (array, key, content) => {
    for (const entry of array.value) {
        if (entry[key] === content) {
            return entry;
        }
    }
};

const lockEntry = index => {
    const entry = arrayEntry(listing, 'id', index);

    if (entry.locked === klik && typeof entry.scored === 'number') {
        // If another yahtzee is scored, restrict scoring to official multiple yahtzee bonus scoring rules
        // if (moreYahtzee ? yahtzeeEyesLocked(index) : true) {
        //     // When another yahtzee is scored, up the bonus
        //     if (moreYahtzee) {
        //         ++extraYahtzee.value;
        //     }

        //     score.final = score.scored;
        //     score.locked = lock;

        //     ++box.locks;

        //     rolling(number);
        //     recount();
        // }

        entry.final = entry.scored;
        entry.locked = lock;
    }
};

// listing.value = initUpper();
</script>

<template>
    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
            </tr>
            <tr @click="lockEntry(entry.id)" v-for="entry in listing" :key="entry.id" :class="entry.locked">
                <td>{{ entry.title }}</td>
                <td>{{ entry.scored }}</td>
                <td>{{ entry.final }}</td>
            </tr>
        </table>
    </div>
</template>
