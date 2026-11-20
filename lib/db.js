// Tiny JSON-file persistence. Reads/writes are synchronous, so each request's
// read-modify-write is atomic within the single Node process.
const fs = require('fs');
const path = require('path');
const { emptyState } = require('./logic');

const DIR = path.join(process.cwd(), 'data');
const PROFILES = path.join(DIR, 'profiles.json');
const STATE = path.join(DIR, 'state.json');

const loadProfiles = () => JSON.parse(fs.readFileSync(PROFILES, 'utf8'));

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE, 'utf8'));
  } catch {
    return emptyState();
  }
}

function saveState(state) {
  const tmp = STATE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, STATE); // atomic replace, no half-written file
}

module.exports = { loadProfiles, loadState, saveState };
