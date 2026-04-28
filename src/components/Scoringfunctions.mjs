import {klik, klak, lock, back, lack} from './Scoringvars.mjs';

// Returns an array of scores from a full list
export const scoress = list => {
    return list.value.scores;
};

// If the entry is locked, no score points will shown
export const entryLocking = (entry, score) => {
    entry.scored = entry.locked === lock ? 0 : score;
};

// Get an entry of an array based upon its key value
// Key can be anything that is differentiable enough
// 'id' is preferred for easy access
export const arrayEntry = (array, key, value) => {
    for (const entry of array) {
        if (entry[key] === value) {
            return entry;
        }
    }
};

// Count the amount of locked entries in the list that are clickable
export const lockCount = list => {
    let locks = 0;

    for (const entry of list) {
        if (entry.locked === lock) {
            ++locks;
        }
    }

    return locks;
};

// Count the amount of summed entries in the list that are locked
const lackCount = list => {
    let lacks = 0;

    // lack is just lock for unclickable entries
    for (const entry of list) {
        if (entry.locked === lack) {
            ++lacks;
        }
    }

    return lacks;
};

// Fully lock a list for the unclickable entries
export const lockList = list => {
    // Once clickable entries are all locked, lock everything else
    if (lockCount(list) > list.length - 4) {
        for (const entry of list) {
            if (entry.locked === back) {
                entry.locked = lack;
            }
        }
    }
};

// Sum over all finalized results
export const finalSummer = list => {
    let summed = 0;

    // Only sum over locked entries, those are finalized
    for (const entry of list) {
        if (entry.locked === lock) {
            summed += entry.final;
        }
    }

    return summed;
};

// Make anything clickable unlclickable without locking it
export const deklak = list => {
    for (const entry of list) {
        if (entry.locked === klak) {
            entry.locked = klik;
        }
    }
};

// Check if the list is fully locked
export const fullyLocking = list => {
    return lockCount(list) + lackCount(list) === list.length;
};

// Reload the page
export const restart = () => {
    location.reload();
};