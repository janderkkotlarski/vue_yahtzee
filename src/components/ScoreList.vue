<script setup>
import {klik} from './Scoringvars.mjs';

// Score needs to be imported in order to be displayed
// const scoreListing = defineModel('scoreListing', {type: Object});

// Again a case where defineProps is simple and safer
defineProps({
    // The score list needs to be imported in order to be displayed 
    scoreListing: {type: Object, default: null},
});

// If the entry can be clicked, show that
const kliksplay = locked => {
    if (locked === klik) {
        return klik;
    }

    return ' ';
};

// Colors the entry correctly
const clickClass = locked => {
    if (locked === klik) {
        return 'switch';
    }

    return ' ';
};
</script>

<template>
    <!-- Inline to get scorelists bsides each other -->
    <div class="inlined">
        <table>
            <!-- Top titles -->
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
                <th>Klikken</th>
            </tr>
            <!-- names, scores, final scores and clickability -->
            <tr v-for="score in scoreListing.scores" :key="score.id" :class="score.locked">
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
                <!-- When successfully clicked lock the entry -->
                <td :class="clickClass(score.locked)" @click="$emit('locker', scoreListing, score.id)">
                    {{ kliksplay(score.locked) }}
                </td>
            </tr>
        </table>
    </div>
</template>
