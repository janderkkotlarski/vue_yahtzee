<script setup>
// import {ref} from 'vue';

import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './Varinit.mjs';

const scoreListing = defineModel('scoreListing', {type: Object});

const yahtzeeVars = defineModel('yahtzeeVars', {
    type: Object,
    default: {
        moreYahtzee: false,
        extraYahtzee: 0,
    },
});

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
        // When another yahtzee is scored, up the bonus
        // if (yahtzeeVars.moreYahtzee) {
        //     ++yahtzeeVars.extraYahtzee;
        // }

        score.final = score.scored;
        score.locked = lock;

        rolling(number);
        recount();
    }
};

const kliksplay = locked => {
    if (locked === klik) {
        return klik;
    }

    return ' ';
};

// // stel: de gegooide stenen vind je in model
// const ones = computed(() => {
//     return model.filter(item => item === 1).length * 1;
// });

//@click="lockEntry(score.id)"
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
            <tr @click="$emit('habbening')" v-for="score in scoreListing.scores" :key="score.id" :class="score.locked">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td>{{ kliksplay(score.locked) }}</td>
            </tr>
        </table>
    </div>

    <div class="inlined">
        {{ yahtzeeVars }}
    </div>
</template>
