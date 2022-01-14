function piecesNameSetting(i, j, $td){
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

function determinePiecesCountry(i, j, $td, myCountry){
  let yourCountry;
  if (myCountry == "cho") yourCountry = "han";
  else yourCountry = "cho";
  $td.setAttribute("data-country", "");
  if ([0].includes(i) && [0, 1, 2, 3, 5, 6, 7, 8].includes(j)){
    $td.setAttribute("data-country", yourCountry);
    return;
  }
  if(i == 1 && j == 4){
    $td.setAttribute("data-country", yourCountry);
    return;
  }
  if ([2].includes(i) && [1, 7].includes(j)){
    $td.setAttribute("data-country", yourCountry);
    return;
  }
  if ([3].includes(i) && [0, 2, 4, 6, 8].includes(j)){
    $td.setAttribute("data-country", yourCountry);
    return;
  }
  if ([9].includes(i) && [0, 1, 2, 3, 5, 6, 7, 8].includes(j)){
    $td.setAttribute("data-country", myCountry);
    return;
  }
  if(i == 8 && j == 4){
    $td.setAttribute("data-country", myCountry);
    return;
  }
  if ([7].includes(i) && [1, 7].includes(j)){
    $td.setAttribute("data-country", myCountry);
    return;
  }
  if ([6].includes(i) && [0, 2, 4, 6, 8].includes(j)){
    $td.setAttribute("data-country", myCountry);
    return;
  }
}

function addHouseClass(i, j, $td){
  if([0, 1, 2, 7, 8, 9].includes(i) && [3, 4, 5].includes(j)){
    $td.classList.add("house");
  }
}

export {piecesNameSetting, determinePiecesCountry, addHouseClass};