<script setup>
import {ref} from 'vue';

import Roller from './components/Roller.vue';
import Scorer from './components/Scorer.vue';
import RollTest from './components/RollTest.vue';

// Need to place this here to serve as the starting base for the defineModel in the child component
// Or else it will not work
const diceArray = ref({
    dice: [],
    clicked: 0,
});

// <Roller />

// <Scorer />
</script>

<template>
    <Roller :diceLine="diceArray" />
</template>
