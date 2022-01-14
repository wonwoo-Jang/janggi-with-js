import {data, myCountry} from "./index.js";

function isCheck(turn){
  const check = data.flat().some((e) => {
    if (e.classList.contains("car") && e.dataset.country == turn) return isCheckedByCar(e, turn);
    if (e.classList.contains("soldier") && e.dataset.country == turn) return isCheckedBySoldier(e, turn);
    if (e.classList.contains("horse") && e.dataset.country == turn) return isCheckedByHorse(e, turn);
    if (e.classList.contains("elephant") && e.dataset.country == turn) return isCheckedByElephant(e, turn);
    if (e.classList.contains("cannon") && e.dataset.country == turn) return isCheckedByCannon(e, turn);
    return false;
  })
  return check;
}

function isCheckedByCar(_this, turn){
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  let i = 1;
  while (true){
    const rightCheck = data[x]?.[y + i];
    if (!rightCheck) break; //아예 칸이 없는 경우 여기에서 종료
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    } //이미 그 칸에 기물이 있으면 종료(여기 수정! 상대 기물 먹을 수 있음)
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x]?.[y - i];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x + i]?.[y];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x - i]?.[y];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
    i++;
  }

  if([0, 7].includes(x) && y == 3){
    i = 1;
    while (true){
      const rightCheck = data[x + i]?.[y + i];
      if (i > 2) break; //궁성 범위를 나가버리면 종료
      if (!rightCheck) break;
      if (rightCheck.dataset.country){
        if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
        break;
      }
      i++;
    }
  }
  else if([0, 7].includes(x) && y == 5){
    i = 1;
    while (true){
      const rightCheck = data[x + i]?.[y - i];
      if (i > 2) break; //궁성 범위를 나가버리면 종료
      if (!rightCheck) break;
      if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
      i++;
    }
  }
  else if([2, 9].includes(x) && y == 3){
    i = 1;
    while (true){
      const rightCheck = data[x - i]?.[y + i];
      if (i > 2) break; //궁성 범위를 나가버리면 종료
      if (!rightCheck) break;
      if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
      i++;
    }
  }
  else if([2, 9].includes(x) && y == 5){
    i = 1;
    while (true){
      const rightCheck = data[x - i]?.[y - i];
      if (i > 2) break; //궁성 범위를 나가버리면 종료
      if (!rightCheck) break;
      if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }
      i++;
    }
  }
  else if([1, 8].includes(x) && y == 4){
    let temp = false;
    [1, -1].forEach((r) => {
      [1, -1].forEach((c) => {
        const rightCheck = data[x + r]?.[y + c];
        if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) temp = true;
      })
    })
    return temp;
  } //궁성에 있다면 대각선 이동 가능!
  return false;
}

function isCheckedBySoldier(_this, turn){
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  let upOrDown = 1;
  if(_this.dataset.country == myCountry){
    upOrDown = -1;
  }
  let rightCheck = data[x]?.[y + 1];
  if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
    return true;
  }
  rightCheck = data[x]?.[y - 1];
  if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
    return true;
  }
  rightCheck = data[x + upOrDown]?.[y];
  if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
    return true;
  }

  if([2, 7].includes(x) && y == 3){
    rightCheck = data[x + upOrDown]?.[y + 1];
    if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
      return true;
    }
  }
  else if([2, 7].includes(x) && y == 5){
    rightCheck = data[x + upOrDown]?.[y - 1];
    if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
      return true;
    }
  }
  else if([1, 8].includes(x) && y == 4){
    rightCheck = data[x + upOrDown]?.[y + 1];
    if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
      return true;
    }
    rightCheck = data[x + upOrDown]?.[y - 1];
    if(rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king")){
      return true;
    }
  } //궁성에 있다면 대각선 이동 가능!
  return false;
}

function isCheckedByHorse(_this, turn){
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].dataset.country){
    if(data[x + 2]?.[y + 1] && data[x + 2]?.[y + 1].dataset.country != turn 
      && data[x + 2]?.[y + 1].classList.contains("king")) return true;
    if(data[x + 2]?.[y - 1] && data[x + 2]?.[y - 1].dataset.country != turn 
      && data[x + 2]?.[y - 1].classList.contains("king")) return true;
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].dataset.country){
    if(data[x - 2]?.[y + 1] && data[x - 2]?.[y + 1].dataset.country != turn 
      && data[x - 2]?.[y + 1].classList.contains("king")) return true;
    if(data[x - 2]?.[y - 1] && data[x - 2]?.[y - 1].dataset.country != turn 
      && data[x - 2]?.[y - 1].classList.contains("king")) return true;
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].dataset.country){
    if(data[x + 1]?.[y + 2] && data[x + 1]?.[y + 2].dataset.country != turn 
      && data[x + 1]?.[y + 2].classList.contains("king")) return true;
    if(data[x - 1]?.[y + 2] && data[x - 1]?.[y + 2].dataset.country != turn 
      && data[x - 1]?.[y + 2].classList.contains("king")) return true;
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].dataset.country){
    if(data[x + 1]?.[y - 2] && data[x + 1]?.[y - 2].dataset.country != turn 
      && data[x]?.[y - 1].classList.contains("king")) return true;
    if(data[x - 1]?.[y - 2] && data[x - 1]?.[y - 2].dataset.country != turn 
      && data[x - 1]?.[y - 2].classList.contains("king")) return true;
  }
  return false;
}

function isCheckedByElephant(_this, turn){
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].dataset.country){
    if(data[x + 2]?.[y + 1] && !data[x + 2]?.[y + 1].dataset.country) {
      if(data[x + 3]?.[y + 2] && data[x + 3]?.[y + 2].dataset.country != turn
        && data[x + 3]?.[y + 2].classList.contains("king")) return true;
    };
    if(data[x + 2]?.[y - 1] && !data[x + 2]?.[y - 1].dataset.country) {
      if(data[x + 3]?.[y - 2] && data[x + 3]?.[y - 2].dataset.country != turn
        && data[x + 3]?.[y - 2].classList.contains("king")) return true;
    };
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].dataset.country){
    if(data[x - 2]?.[y + 1] && !data[x - 2]?.[y + 1].dataset.country) {
      if(data[x - 3]?.[y + 2] && data[x - 3]?.[y + 2].dataset.country != turn
        && data[x - 3]?.[y + 2].classList.contains("king")) return true;
    };
    if(data[x - 2]?.[y - 1] && !data[x - 2]?.[y - 1].dataset.country) {
      if(data[x - 3]?.[y - 2] && data[x - 3]?.[y - 2].dataset.country != turn
        && data[x - 3]?.[y - 2].classList.contains("king")) return true;
    };
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].dataset.country){
    if(data[x + 1]?.[y + 2] && !data[x + 1]?.[y + 2].dataset.country) {
      if(data[x + 2]?.[y + 3] && data[x + 2]?.[y + 3].dataset.country != turn
        && data[x + 2]?.[y + 3].classList.contains("king")) return true;
    };
    if(data[x - 1]?.[y + 2] && !data[x - 1]?.[y + 2].dataset.country) {
      if(data[x - 2]?.[y + 3] && data[x - 2]?.[y + 3].dataset.country != turn
        && data[x - 2]?.[y + 3].classList.contains("king")) return true;
    };
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].dataset.country){
    if(data[x + 1]?.[y - 2] && !data[x + 1]?.[y - 2].dataset.country) {
      if(data[x + 2]?.[y - 3] && data[x + 2]?.[y - 3].dataset.country != turn
        && data[x + 2]?.[y - 3].classList.contains("king")) return true;
    };
    if(data[x - 1]?.[y - 2] && !data[x - 1]?.[y - 2].dataset.country) {
      if(data[x - 2]?.[y - 3] && data[x - 2]?.[y - 3].dataset.country != turn
        && data[x - 2]?.[y - 3].classList.contains("king")) return true;
    };
  }
  return false;
}

function isCheckedByCannon(_this, turn){
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  let i = 1;
  let pivot = false;
  while (true){
    const rightCheck = data[x]?.[y + i];
    if (!rightCheck) break;
    if (!pivot && rightCheck.dataset.country && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[x]?.[y - i];
    if (!rightCheck) break;
    if (!pivot && rightCheck.dataset.country && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[x + i]?.[y];
    if (!rightCheck) break;
    if (!pivot && rightCheck.dataset.country && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    } 
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[x - i]?.[y];
    if (!rightCheck) break;
    if (!pivot && rightCheck.dataset.country && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn && rightCheck.classList.contains("king")) return true;
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    i++;
  }

  if([0, 7].includes(x) && y == 3 && data[x + 1][y + 1].dataset.country && !data[x + 1][y + 1].classList.contains("cannon")){
    const rightCheck = data[x + 2]?.[y + 2];
    if (rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king"))  return true;
  }
  else if([0, 7].includes(x) && y == 5 && data[x + 1][y - 1].dataset.country && !data[x + 1][y - 1].classList.contains("cannon")){
    const rightCheck = data[x + 2]?.[y - 2];
    if (rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king"))  return true;
  }
  else if([2, 9].includes(x) && y == 3 && data[x - 1][y + 1].dataset.country && !data[x - 1][y + 1].classList.contains("cannon")){
    const rightCheck = data[x - 2]?.[y + 2];
    if (rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king"))  return true;
  }
  else if([2, 9].includes(x) && y == 5 && data[x - 1][y - 1].dataset.country && !data[x - 1][y - 1].classList.contains("cannon")){
    const rightCheck = data[x - 2]?.[y - 2];
    if (rightCheck && rightCheck.dataset.country != turn && rightCheck.classList.contains("king"))  return true;
  } //궁성에 있다면 대각선 이동 가능!
  return false;
}

export {isCheck};