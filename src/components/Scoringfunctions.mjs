import {lock} from './Varinit.mjs';

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
