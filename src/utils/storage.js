export const saveState = (key, value) => {
  const state = JSON.parse(localStorage.getItem("state")) || {};
  state[key] = value;
  localStorage.setItem("state", JSON.stringify(state));
};

export const loadState = (key) => {
  const state = JSON.parse(localStorage.getItem("state")) || {};
  return state ? state[key] : null;
};
