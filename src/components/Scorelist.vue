<script setup>
// import {ref} from 'vue';

import {klik} from './Varinit.mjs';

const scoreListing = defineModel('scoreListing', {type: Object});

const yahtzeeVars = defineModel('yahtzeeVars', {
    type: Object,
    default: {
        moreYahtzee: false,
        extraYahtzee: 0,
    },
});

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
            <tr
                @click="$emit('locker', scoreListing, score.id)"
                v-for="score in scoreListing.scores"
                :key="score.id"
                :class="score.locked"
            >
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td>{{ kliksplay(score.locked) }}</td>
            </tr>
        </table>
    </div>
</template>
