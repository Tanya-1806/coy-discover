// Pure business logic (no I/O) so it is easy to test.
// state = { swipes: { [profileId]: 'like' | 'pass' }, matches: [profileId] }
const DIRECTIONS = ['like', 'pass'];

const emptyState = () => ({ swipes: {}, matches: [] });

// Core privacy rule: `likedYou` must never leave the server.
const publicProfile = ({ likedYou, ...rest }) => rest;

const hasSwiped = (state, id) => Object.prototype.hasOwnProperty.call(state.swipes, id);

function getFeed(profiles, state) {
  return profiles.filter((p) => !hasSwiped(state, p.id)).map(publicProfile);
}

function applySwipe(profiles, state, profileId, direction) {
  if (typeof profileId !== 'string') return { status: 400, error: 'profileId must be a string' };
  if (!DIRECTIONS.includes(direction)) return { status: 400, error: 'direction must be "like" or "pass"' };
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return { status: 404, error: 'Profile not found' };
  if (hasSwiped(state, profileId)) return { status: 409, error: 'Already swiped on this profile' };

  // Match only when BOTH sides liked each other.
  const match = direction === 'like' && profile.likedYou === true;
  return {
    status: 200,
    match,
    profile: publicProfile(profile),
    state: {
      swipes: { ...state.swipes, [profileId]: direction },
      matches: match ? [...state.matches, profileId] : state.matches,
    },
  };
}

function getMatches(profiles, state) {
  return state.matches
    .map((id) => profiles.find((p) => p.id === id))
    .filter(Boolean)
    .map(publicProfile)
    .reverse(); // newest first
}

module.exports = { DIRECTIONS, emptyState, publicProfile, getFeed, applySwipe, getMatches };
