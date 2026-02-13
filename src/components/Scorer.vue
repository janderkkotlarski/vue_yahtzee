<script setup>
import {ref, reactive} from 'vue';
import Dice from './Dice.vue';
import Scorelist from './Scorelist.vue';

const valueMax = 6;
const diceAmount = 5;

const normal = '______';

const klik = 'klik';
const klak = 'klak';
const lock = 'lock';

const back = 'back';
const lack = 'lack';

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
        {id: 'lower', title: 'Onder Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
        {id: 'total', title: 'Geheel Totaal', scored: ' ', final: 0, yonus: 'never', locked: back},
    ],
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

    let index = 1;

    for (const amount of multiples.counts) {
        amount.count = countNumber(index);

        if (sameMax.value < amount.count) {
            sameMax.value = amount.count;
        }

        if (sameMax.value === diceAmount) {
            yahtzeeNumber.value = index;
        }

        ++index;
    }
};

const entryLocking = (entry, score) => {
    entry.scored = entry.locked === lock ? 0 : score;
};

const diceSum = ref(0);

const summing = () => {
    diceSum.value = 0;

    for (const cube of diceArray.dice) {
        diceSum.value += cube.rolled;
    }
};

const countUpper = () => {
    let index = 1;

    for (const entry of scoreUpper.scores) {
        if (entry.locked != back && entry.locked != lack) {
            const score = arrayEntry(multiples.counts, 'id', entry.id).count * entry.id;
            entryLocking(entry, score);
        }

        ++index;
    }
};

const lockCount = list => {
    let locks = 0;

    for (const entry of list) {
        if (entry.locked === lock) {
            ++locks;
        }
    }

    return locks;
};

const lackCount = list => {
    let lacks = 0;

    for (const entry of list) {
        if (entry.locked === lack) {
            ++lacks;
        }
    }

    return lacks;
};

const lockList = list => {
    if (lockCount(list) > list.length - 4) {
        for (const entry of list) {
            if (entry.locked === back) {
                entry.locked = lack;
            }
        }
    }
};

const finalSummer = list => {
    let summed = 0;

    for (const entry of list) {
        if (entry.locked === klik || entry.locked === lock) {
            summed += entry.final;
        }
    }

    return summed;
};

const sumUpper = () => {
    const scores = scoreUpper.scores;
    const summed = finalSummer(scores);

    arrayEntry(scores, 'id', 'summed').final = summed;
    const bonus = summed >= 63 ? 35 : 0;
    arrayEntry(scores, 'id', 'bonus').final = bonus;
    arrayEntry(scores, 'id', 'upper').final = summed + bonus;

    lockList(scores);
};

const multiYahtzee = () => {
    moreYahtzee = arrayEntry(scoreLower.scores, 'id', 'yahtzee').final === 50 && yahtzeeNumber.value != 0;
};

const deklak = list => {
    for (const entry of list) {
        if (entry.locked === klak) {
            entry.locked = klik;
        }
    }
};

const klikable = () => {
    deklak(scoreUpper.scores);
    deklak(scoreLower.scores);

    if (moreYahtzee) {
        if (
            arrayEntry(scoreUpper.scores, 'id', yahtzeeNumber.value).locked != lock ||
            lockCount(scoreLower.scores) + 3 < scoreLower.scores.length
        ) {
            for (const entry of scoreUpper.scores) {
                if (entry.locked === klik && entry.id != yahtzeeNumber.value) {
                    entry.locked = klak;
                }
            }
        }

        if (arrayEntry(scoreUpper.scores, 'id', yahtzeeNumber.value).locked != lock) {
            for (const entry of scoreLower.scores) {
                if (entry.locked === klik) {
                    entry.locked = klak;
                }
            }
        }
    }
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
    let counted = 0;

    for (const amount of multiples.counts) {
        counted = amount.count ? counted + 1 : 0;

        if (counted > consec) {
            consec = counted;
        }
    }

    if (moreYahtzee) {
        consec = 5;
    }

    return consec;
};

const lowerScoring = () => {
    const scoreSheet = [];

    scoreSheet.push({id: 'three', score: sameMax.value >= 3 ? diceSum.value : 0});
    scoreSheet.push({id: 'four', score: sameMax.value >= 4 ? diceSum.value : 0});
    scoreSheet.push({id: 'full', score: filledHouse() ? 25 : 0});
    scoreSheet.push({id: 'small', score: consecutive() > 3 ? 30 : 0});
    scoreSheet.push({id: 'large', score: consecutive() > 4 ? 40 : 0});
    scoreSheet.push({id: 'chance', score: diceSum.value});
    scoreSheet.push({id: 'yahtzee', score: sameMax.value === diceAmount ? 50 : 0});

    return scoreSheet;
};

const countLower = () => {
    const scoreSheet = lowerScoring();

    for (const entry of scoreLower.scores) {
        if (entry.locked != back) {
            entryLocking(entry, arrayEntry(scoreSheet, 'id', entry.id).score);
        }
    }
};

const fullyLocking = list => {
    return lockCount(list) + lackCount(list) === list.length;
};

const sumLower = () => {
    const scores = scoreLower.scores;
    const summed = finalSummer(scores);

    arrayEntry(scores, 'id', 'yonus').final = extraYahtzee.value * 100;
    arrayEntry(scores, 'id', 'lower').final = summed;
    arrayEntry(scores, 'id', 'total').final =
        summed + extraYahtzee.value * 100 + arrayEntry(scoreUpper.scores, 'id', 'upper').final;

    if (fullyLocking(scoreUpper.scores)) {
        lockList(scores);
    }
};

const recount = () => {
    countMultiples();
    multiYahtzee();
    klikable();
    summing();

    countUpper();
    sumUpper();

    countLower();
    sumLower();
};

recount();

const yahtzeeClicking = index => {
    return (
        index === yahtzeeNumber.value ||
        (arrayEntry(scoreUpper.scores, 'id', yahtzeeNumber.value).locked === lock && typeof index != 'number') ||
        lockCount(scoreLower.scores) + 3 === scoreLower.scores.length
    );
};

const kliksplay = locked => {
    if (locked === klik) {
        return klik;
    }

    return ' ';
};

const lockEntry = (box, index) => {
    const score = arrayEntry(box.scores, 'id', index);

    if (score.locked === klik && typeof score.scored === 'number') {
        // If another yahtzee is scored, restrict scoring to official multiple yahtzee bonus scoring rules
        if (moreYahtzee ? yahtzeeClicking(index) : true) {
            // When another yahtzee is scored, up the bonus
            if (moreYahtzee) {
                ++extraYahtzee.value;
            }

            score.final = score.scored;
            score.locked = lock;

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

// <Scorelist :listing="scoreUpper.scores" />
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
                <th>Klikbaar</th>
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
                <td>{{ kliksplay(score.locked) }}</td>
            </tr>
        </table>
    </div>

    <div class="inlined">
        <table>
            <tr>
                <th>Combinatie</th>
                <th>Punten</th>
                <th>Gescoord</th>
                <th>Klikbaar</th>
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
                <td>{{ kliksplay(score.locked) }}</td>
            </tr>
        </table>
    </div>

    <br />
    <br />
</template>
