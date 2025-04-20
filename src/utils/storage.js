export const saveState = (key, value) => {
  const state = JSON.parse(localStorage.getItem("state")) || {};
  state[key] = value;
  localStorage.setItem("state", JSON.stringify(state));
};

export const loadState = (key) => {
  const state = JSON.parse(localStorage.getItem("state")) || {};
  return state ? state[key] : null;
};


export const saveFoundCompound = (compound) => {
  try {
    // 기존 화합물 가져오기
    const existingCompoundsJSON = localStorage.getItem('foundCompounds');
    const existingCompounds = existingCompoundsJSON ? JSON.parse(existingCompoundsJSON) : [];
    
    // 이미 저장된 화합물인지 확인
    const compoundExists = existingCompounds.some(item => item.name === compound.name);
    
    // 존재하지 않는 경우에만 추가
    if (!compoundExists) {
      existingCompounds.push(compound);
      localStorage.setItem('foundCompounds', JSON.stringify(existingCompounds));
      return true; // 성공적으로 추가됨
    }
    
    return false; // 이미 존재함
  } catch (error) {
    console.error('화합물 저장 오류:', error);
    return false;
  }
};

// 저장된 화합물 불러오기
export const loadFoundCompounds = () => {
  try {
    const compounds = localStorage.getItem('foundCompounds');
    return compounds ? JSON.parse(compounds) : [];
  } catch (error) {
    console.error('화합물 로드 오류:', error);
    return [];
  }
};