<script setup>
const back = 'back';
const klik = 'klik';

const scoreLine = defineModel('scoreLine', {
    type: Object,
    default: {id: 0, title: ' ', scored: 0, final: 0, locked: back},
});
</script>

<template>
    <div class="inlined">
        {{ scoreLine }}
    </div>
</template>
