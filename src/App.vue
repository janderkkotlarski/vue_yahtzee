<script setup>
import {ref} from 'vue';

import Roller from './components/Roller.vue';
import Scorer from './components/Scorer.vue';
import Scorelist from './components/Scorelist.vue';
import RollTest from './components/RollTest.vue';

import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './components/Varinit.mjs';

const extraYahtzee = ref(0);
const yahtzeeNumber = ref(0);
let moreYahtzee = false;

const scoreUpper = ref(scoreUpperInit);

// Need to place this here to serve as the starting base for the defineModel in the child component
// Or else it will not work
// It also is a good shared
const diceArray = ref({dice: [], clicked: 0});

const diceClap = ref({dice: [], clicked: 0});

// <Roller :diceLine="diceArray" />
// <RollTest :diceLine="diceArray" />
// <Scorelist :scoreListing="scoreUpper" :yahtzeeVars="{moreYahtzee, extraYahtzee}" />
// <Scorer />
</script>

<template>
    <RollTest :diceLine="diceArray" />
</template>
