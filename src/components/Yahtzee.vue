<script setup>
import {ref} from 'vue';

import Roller from './Roller.vue';
import Scorer from './Scorer.vue';
// import Scorelist from './components/Scorelist.vue';

// import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './components/Varinit.mjs';

const rollerNumber = 0;

const resetRef = ref(null);

const resetParent = () => {
    resetRef.value.diceArrayReset();
};

// const extraYahtzee = ref(0);
// const yahtzeeNumber = ref(0);

// const scoreUpper = ref(scoreUpperInit);

// Need to place this here to serve as the starting base for the defineModel in the child component
// Or else it will not work
// It also is a good shared
const diceArray = ref({dice: [], clicked: 0});

// const diceClap = ref({dice: [], clicked: 0});

//     <Roller :diceLine="diceClap" />

// <Roller :diceLine="diceArray" />
// <Scorelist :scoreListing="scoreUpper" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
// <Scorer />
</script>

<template>
    <Roller ref="resetRef" @recounting="recount" :diceLine="diceArray" :numberLine="rollerNumber" />

    <div>
        <button @click="resetParent">Herklikken</button>
    </div>

    <Scorer />
</template>
