export const countMultiples_ = (multiples, yahtzeeNumber, diceAmount, sameMax) => {
    sameMax = 0;
    yahtzeeNumber.value = 0;

    let index = 1;
    let yahtzee = false;

    for (const amount of multiples.counts) {
        amount.count = countNumber(index);

        if (sameMax < amount.count) {
            sameMax = amount.count;
        }

        // yahtzee needed so yahtzeeNumber does not go to 6 when index gets upped
        if (sameMax === diceAmount && !yahtzee) {
            yahtzeeNumber.value = index;

            yahtzee = true;
        }

        ++index;
    }
};
