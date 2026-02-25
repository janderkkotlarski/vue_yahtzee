<script setup>
const scoreUpperInit = {
    scores: [
        {id: 1, title: 'Enen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 2, title: 'Tweeën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 3, title: 'Drieën', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 4, title: 'Vieren', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 5, title: 'Vijfen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 6, title: 'Zessen', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'summed', title: 'Getallen', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'bonus', title: 'Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'upper', title: 'Boven Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
};

const scoreLowerInit = {
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'four', title: '4 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'full', title: 'Full House', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'small', title: 'Kleine Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'large', title: 'Grote Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'chance', title: 'Kans', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0, final: 0, yonus: 'negate', locked: klik},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'lower', title: 'Onder Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
};
</script>
