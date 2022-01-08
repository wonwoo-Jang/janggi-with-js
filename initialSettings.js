function boardClassSetting(i, j, $td){
  if ([0, 9].includes(i) && [0, 8].includes(j)){
    $td.classList.add("car");
    return;
  }
  if ([0, 9].includes(i) && [3, 5].includes(j)){
    $td.classList.add("scholar");
    return;
  }
  if ([1, 8].includes(i) && [4].includes(j)){
    $td.classList.add("king");
    return;
  }
  if ([2, 7].includes(i) && [1, 7].includes(j)){
    $td.classList.add("cannon");
    return;
  }
  if ([3, 6].includes(i) && [0, 2, 4, 6, 8].includes(j)){
    $td.classList.add("soldier");
    return;
  } //상과 마 상차림 제외한 기물 시작 지점에 class추가
  if ([0, 9].includes(i) && [1, 6].includes(j)){
    $td.classList.add("horse");
    return;
  }
  if ([0, 9].includes(i) && [2, 7].includes(j)){
    $td.classList.add("elephant");
    return;
  } //상차림 하는거 추가하기(지금은 귀마 대 귀마로 설정)
}

function boardContentSetting($td){
  const janggiPieces = $td.classList.value;
  if (janggiPieces) $td.textContent = janggiPieces.slice(0, 1); //나중에 여기 부분 이미지로 변경하기
}

export {boardClassSetting, boardContentSetting};