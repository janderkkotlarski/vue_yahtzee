<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const open = 'open';
const klik = 'klik';
const back = 'back';
const lock = 'lock';

let moreYahtzee = false;

const sameMax = ref(0);
const extraYahtzee = ref(0);
const yahtzeeNumber = ref(0);

const diceArray = reactive({
    dice: [],
});

const diceArrayFilling = () => {
    for (let index = 1; index <= diceAmount; ++index) {
        diceArray.dice.push({id: index, rolled: index});
    }
};

diceArrayFilling();

const roll = () => Math.floor(valueMax * Math.random()) + 1;

const diceReroll = () => {
    for (const cube of diceArray.dice) {
        cube.rolled = roll();
    }
};

const rollYahtzee = number => {
    for (const cube of diceArray.dice) {
        cube.rolled = number;
    }
};

const rolling = number => {
    if (number >= 1 && number <= valueMax) {
        rollYahtzee(number);
    } else {
        diceReroll();
    }
};

const number = 6;

rolling(number);

const cuboid = index => {
    if (index > 0 && index <= diceAmount) {
        return diceArray.dice[index - 1];
    }
};

const scoreUpper = reactive({
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
    locks: 0,
});

const scoreLower = reactive({
    scores: [
        {id: 'three', title: '3 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'four', title: '4 Gelijke', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'full', title: 'Full House', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'small', title: 'Kleine Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'large', title: 'Grote Straat', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'chance', title: 'Kans', scored: 0, final: 0, yonus: 'null', locked: klik},
        {id: 'yahtzee', title: 'Yahtzee', scored: 0, final: 0, yonus: 'negate', locked: klik},
        {id: 'yonus', title: 'Yahtzee Bonus', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'lower', title: 'Lager Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
    locks: 0,
});

const multiples = reactive({
    counts: [],
});

const initMultiples = () => {
    for (let index = 1; index <= valueMax; ++index) {
        multiples.counts.push({id: index, count: 0});
    }
};

initMultiples();

const countNumber = number => {
    let count = 0;

    for (let index = 0; index < diceAmount; ++index) {
        if (diceArray.dice[index].rolled === number) {
            ++count;
        }
    }

    return count;
};

const arrayEntry = (array, key, value) => {
    for (const entry of array) {
        if (entry[key] === value) {
            return entry;
        }
    }
};

const countMultiples = () => {
    sameMax.value = 0;
    yahtzeeNumber.value = 0;

    for (let index = 1; index <= valueMax; ++index) {
        arrayEntry(multiples.counts, 'id', index).count = countNumber(index);

        if (sameMax.value < arrayEntry(multiples.counts, 'id', index).count) {
            sameMax.value = arrayEntry(multiples.counts, 'id', index).count;
        }

        if (sameMax.value === diceAmount) {
            yahtzeeNumber.value = index;
        }
    }
};

const diceSum = ref(0);

const countUpper = () => {
    diceSum.value = 0;

    for (let number = 1; number <= valueMax; ++number) {
        const score = arrayEntry(multiples.counts, 'id', number).count * number;

        arrayEntry(scoreUpper.scores, 'id', number).scored = score;

        diceSum.value += score;
    }
};

const fullyLocked = scoreSheet => {
    if (scoreSheet.locks === scoreSheet.scores.length - 3) {
        for (const score of scoreSheet.scores) {
            if (score.locked === back) {
                score.locked = lock;
                ++scoreSheet.locks;
            }
        }
    }
};

const sumUpper = () => {
    let summed = 0;
    const scores = scoreUpper.scores;

    for (let number = 1; number <= valueMax; ++number) {
        summed += arrayEntry(scores, 'id', number).final;
    }

    arrayEntry(scores, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scores, 'id', 'bonus').final = bonus;
    arrayEntry(scores, 'id', 'upper').final = summed + bonus;

    fullyLocked(scoreUpper);
};

const multiYahtzee = () => {
    if (arrayEntry(scoreLower.scores, 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0) {
        return true;
    }

    return false;
};

// Check if there are 3 dice with a value and 2 dice with another value
const filledHouse = () => {
    if (sameMax.value === 3) {
        for (const amount of multiples.counts) {
            if (amount.count == 2) {
                return true;
            }
        }
    }

    return moreYahtzee;
};

// Check whether 4 or 5 consecutive numeric values can be found among the thrown dice
const consecutive = () => {
    let consec = 0;

    // Start from a lowest value
    for (let index = 1; index < 4; ++index) {
        let mult = arrayEntry(scoreUpper.scores, 'id', index).scored;

        // When there is a value found, start multiplying
        if (mult > 0) {
            let streak = 1;

            // Keep multiplying
            for (let jndex = index + 1; jndex <= valueMax; ++jndex) {
                mult *= arrayEntry(scoreUpper.scores, 'id', jndex).scored;

                // Check multiplication value.
                if (mult > 0) {
                    ++streak;

                    if (streak === 4) {
                        consec = 4;
                    }

                    if (streak === 5) {
                        return 5;
                    }
                }
            }
        }
    }

    if (moreYahtzee) {
        consec = 5;
    }

    return consec;
};

const countLower = () => {
    const straight = consecutive();

    const scores = scoreLower.scores;

    arrayEntry(scores, 'id', 'three').scored = sameMax.value >= 3 ? diceSum.value : 0;
    arrayEntry(scores, 'id', 'four').scored = sameMax.value >= 4 ? diceSum.value : 0;

    arrayEntry(scores, 'id', 'full').scored = filledHouse() ? 25 : 0;

    arrayEntry(scores, 'id', 'small').scored = straight > 3 ? 30 : 0;
    arrayEntry(scores, 'id', 'large').scored = straight > 4 ? 40 : 0;

    arrayEntry(scores, 'id', 'chance').scored = diceSum.value;
    arrayEntry(scores, 'id', 'yahtzee').scored = sameMax.value === 5 ? 50 : 0;
};

const sumLower = () => {
    let summed = 0;
    const scores = scoreLower.scores;

    const indices = [
        {id: 'three'},
        {id: 'four'},
        {id: 'full'},
        {id: 'small'},
        {id: 'large'},
        {id: 'chance'},
        {id: 'yahtzee'},
    ];

    for (const index of indices) {
        summed += arrayEntry(scores, 'id', index.id).final;
    }

    arrayEntry(scores, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scores, 'id', 'lower').final = summed;
    arrayEntry(scores, 'id', 'total').final =
        summed + extraYahtzee.value * 100 + arrayEntry(scoreUpper.scores, 'id', 'upper').final;

    fullyLocked(scoreLower);
};

const recount = () => {
    countMultiples();
    moreYahtzee = multiYahtzee();
    countUpper();
    sumUpper();
    countLower();
    sumLower();
};

recount();

const yahtzeeEyesLocked = index => {
    for (let eyes = 1; eyes <= valueMax; ++eyes) {
        if (arrayEntry(multiples.counts, 'id', eyes).count === 5) {
            return (
                index === eyes ||
                (arrayEntry(scoreUpper.scores, 'id', eyes).locked === lock && typeof index != 'number') ||
                scoreLower.locks === scoreLower.scores.length
            );
        }
    }

    return true;
};

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        // If another yahtzee is scored, restrict scoring to official multiple yahtzee bonus scoring rules
        if (moreYahtzee ? yahtzeeEyesLocked(index) : true) {
            // When another yahtzee is scored, up the bonus
            if (moreYahtzee) {
                ++extraYahtzee.value;
            }

            score.final = score.scored;
            score.locked = lock;

            ++box.locks;

            rolling(number);
            recount();
        }
    }
};

const uptick = index => {
    if (index > 0 && index <= diceAmount) {
        const cubid = cuboid(index);

        ++cubid.rolled;

        if (cubid.rolled > valueMax) {
            cubid.rolled -= valueMax;
        }
    }

    recount();
};
</script>

<template>
    <div>
        <Dice
            @click="uptick(cube.id)"
            v-for="cube in diceArray.dice"
            :key="cube.id"
            v-model:eyeValue="cube.rolled"
            :class="normal"
            :inverted="normal"
        />
    </div>

    <br />
    <br />

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
            </tr>
            <tr
                @click="lockEntry(scoreUpper, score.id)"
                v-for="score in scoreUpper.scores"
                :key="score.id"
                :class="score.locked"
            >
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
            </tr>
        </table>
    </div>

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
            </tr>
            <tr
                @click="lockEntry(scoreLower, score.id)"
                v-for="score in scoreLower.scores"
                :key="score.id"
                :class="score.locked"
            >
                <td>{{ score.title }}</td>
                <td>{{ score.scored }}</td>
                <td>{{ score.final }}</td>
            </tr>
        </table>
    </div>

    <br />
    <br />
</template>
