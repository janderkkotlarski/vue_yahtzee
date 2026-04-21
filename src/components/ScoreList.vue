<script setup>
import {klik} from './Varinit.mjs';

const scoreListing = defineModel('scoreListing', {type: Object});

const kliksplay = locked => {
    if (locked === klik) {
        return klik;
    }

    return ' ';
};

const clickClass = locked => {
    if (locked === klik) {
        return 'switch';
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
                <th>Klikken</th>
            </tr>
            <tr v-for="score in scoreListing.scores" :key="score.id" :class="score.locked">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <td :class="clickClass(score.locked)" @click="$emit('locker', scoreListing, score.id)">
                    {{ kliksplay(score.locked) }}
                </td>
            </tr>
        </table>
    </div>
</template>
