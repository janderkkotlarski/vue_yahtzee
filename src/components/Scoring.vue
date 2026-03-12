<script setup>
import {ref} from 'vue';
import Dice from './Dice.vue';
import RollTest from './RollTest.vue';
import Scorelist from './Scorelist.vue';
import {klik, klak, lock, back, lack, scoreUpperInit, scoreLowerInit} from './Varinit.mjs';

import {countMultiples_} from './Functinit.mjs';

const valueMax = 6;
const diceAmount = 5;
const rollNumber = 0;

const normal = '______';

let sameMax = 0;
const extraYahtzee = ref(0);
const yahtzeeNumber = ref(0);
let moreYahtzee = false;

const diceArray = ref({
    dice: [],
});

const multiples = ref({
    counts: [],
});
</script>
