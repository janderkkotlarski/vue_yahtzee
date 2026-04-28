import {klik, klak, lock, back, lack} from './Scoringvars.mjs';

export const scoress = list => {
    return list.value.scores;
};

export const entryLocking = (entry, score) => {
    entry.scored = entry.locked === lock ? 0 : score;
};

export const arrayEntry = (array, key, value) => {
    for (const entry of array) {
        if (entry[key] === value) {
            return entry;
        }
    }
};

export const lockCount = list => {
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

export const lockList = list => {
    if (lockCount(list) > list.length - 4) {
        for (const entry of list) {
            if (entry.locked === back) {
                entry.locked = lack;
            }
        }
    }
};

export const finalSummer = list => {
    let summed = 0;

    for (const entry of list) {
        if (entry.locked === klik || entry.locked === lock) {
            summed += entry.final;
        }
    }

    return summed;
};

export const deklak = list => {
    for (const entry of list) {
        if (entry.locked === klak) {
            entry.locked = klik;
        }
    }
};

export const fullyLocking = list => {
    return lockCount(list) + lackCount(list) === list.length;
};

export const restart = () => {
    location.reload();
};