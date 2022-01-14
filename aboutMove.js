import {data, myCountry, turn as startTurn} from "./index.js";
import {isCheck} from "./aboutCheckLogic.js";
let beforeClickedPiece; //이전에 클릭된 기물이 저장되는 곳(td를 저장)
let turn = startTurn;
const diePiecesNameForCho = []; 
const diePiecesNameForHan = []; //먹힌 기물들 모아놓는 배열(이름 저장)

function carValidMove(_this) {
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  let i = 1;
  while (true){
    const rightCheck = data[x]?.[y + i];
    if (!rightCheck) break; //아예 칸이 없는 경우 여기에서 종료
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    } //이미 그 칸에 기물이 있으면 종료(여기 수정! 상대 기물 먹을 수 있음)
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x]?.[y - i];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x + i]?.[y];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[x - i]?.[y];
    if (!rightCheck) break;
    if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
    rightCheck.classList.toggle("valid");
    i++;
  }

  if([0, 7].includes(x) && y == 3){
    i = 1;
    while (true){
      const rightCheck = data[x + i]?.[y + i];
      if (i > 2) break; //궁성 범위를 나가버리면 종료
      if (!rightCheck) break;
      if (rightCheck.dataset.country){
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
      rightCheck.classList.toggle("valid");
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
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
      rightCheck.classList.toggle("valid");
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
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
      rightCheck.classList.toggle("valid");
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
      if (rightCheck.dataset.country != turn) rightCheck.classList.toggle("valid");
      break;
    }
      rightCheck.classList.toggle("valid");
      i++;
    }
  }
  else if([1, 8].includes(x) && y == 4){
    [1, -1].forEach((r) => {
      [1, -1].forEach((c) => {
        const rightCheck = data[x + r]?.[y + c];
        if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)) rightCheck.classList.toggle("valid");
      })
    })
  } //궁성에 있다면 대각선 이동 가능!
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function soldierValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  let upOrDown = 1;
  if(_this.dataset.country == myCountry){
    upOrDown = -1;
  }
  let rightCheck = data[x]?.[y + 1];
  if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[x]?.[y - 1];
  if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[x + upOrDown]?.[y];
  if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
    rightCheck.classList.toggle("valid");
  }

  if([2, 7].includes(x) && y == 3){
    rightCheck = data[x + upOrDown]?.[y + 1];
    if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
      rightCheck.classList.toggle("valid");
    }
  }
  else if([2, 7].includes(x) && y == 5){
    rightCheck = data[x + upOrDown]?.[y - 1];
    if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
      rightCheck.classList.toggle("valid");
    }
  }
  else if([1, 8].includes(x) && y == 4){
    rightCheck = data[x + upOrDown]?.[y + 1];
    if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
      rightCheck.classList.toggle("valid");
    }
    rightCheck = data[x + upOrDown]?.[y - 1];
    if(rightCheck && !rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn)){
      rightCheck.classList.toggle("valid");
    }
  } //궁성에 있다면 대각선 이동 가능!
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function horseValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].dataset.country){
    if(data[x + 2]?.[y + 1] && !data[x + 2]?.[y + 1].dataset.country 
      || (data[x + 2]?.[y + 1] && data[x + 2]?.[y + 1].dataset.country != turn)) data[x + 2]?.[y + 1].classList.toggle("valid");
    if(data[x + 2]?.[y - 1] && !data[x + 2]?.[y - 1].dataset.country
      || (data[x + 2]?.[y - 1] && data[x + 2]?.[y - 1].dataset.country != turn)) data[x + 2]?.[y - 1].classList.toggle("valid");
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].dataset.country){
    if(data[x - 2]?.[y + 1] && !data[x - 2]?.[y + 1].dataset.country
      || (data[x - 2]?.[y + 1] && data[x - 2]?.[y + 1].dataset.country != turn)) data[x - 2]?.[y + 1].classList.toggle("valid");
    if(data[x - 2]?.[y - 1] && !data[x - 2]?.[y - 1].dataset.country
      || (data[x - 2]?.[y - 1] && data[x - 2]?.[y - 1].dataset.country != turn)) data[x - 2]?.[y - 1].classList.toggle("valid");
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].dataset.country){
    if(data[x + 1]?.[y + 2] && !data[x + 1]?.[y + 2].dataset.country
      || (data[x + 1]?.[y + 2] && data[x + 1]?.[y + 2].dataset.country != turn)) data[x + 1]?.[y + 2].classList.toggle("valid");
    if(data[x - 1]?.[y + 2] && !data[x - 1]?.[y + 2].dataset.country
      || (data[x - 1]?.[y + 2] && data[x - 1]?.[y + 2].dataset.country != turn)) data[x - 1]?.[y + 2].classList.toggle("valid");
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].dataset.country){
    if(data[x + 1]?.[y - 2] && !data[x + 1]?.[y - 2].dataset.country
      || (data[x + 1]?.[y - 2] && data[x + 1]?.[y - 2].dataset.country != turn)) data[x + 1]?.[y - 2].classList.toggle("valid");
    if(data[x - 1]?.[y - 2] && !data[x - 1]?.[y - 2].dataset.country
      || (data[x - 1]?.[y - 2] && data[x - 1]?.[y - 2].dataset.country != turn)) data[x - 1]?.[y - 2].classList.toggle("valid");
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function elephantValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].dataset.country){
    if(data[x + 2]?.[y + 1] && !data[x + 2]?.[y + 1].dataset.country) {
      if(data[x + 3]?.[y + 2] && !data[x + 3]?.[y + 2].dataset.country
        || (data[x + 3]?.[y + 2] && data[x + 3]?.[y + 2].dataset.country != turn)) data[x + 3]?.[y + 2].classList.toggle("valid");
    };
    if(data[x + 2]?.[y - 1] && !data[x + 2]?.[y - 1].dataset.country) {
      if(data[x + 3]?.[y - 2] && !data[x + 3]?.[y - 2].dataset.country
        || (data[x + 3]?.[y - 2] && data[x + 3]?.[y - 2].dataset.country != turn)) data[x + 3]?.[y - 2].classList.toggle("valid");
    };
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].dataset.country){
    if(data[x - 2]?.[y + 1] && !data[x - 2]?.[y + 1].dataset.country) {
      if(data[x - 3]?.[y + 2] && !data[x - 3]?.[y + 2].dataset.country
        || (data[x - 3]?.[y + 2] && data[x - 3]?.[y + 2].dataset.country != turn)) data[x - 3]?.[y + 2].classList.toggle("valid");
    };
    if(data[x - 2]?.[y - 1] && !data[x - 2]?.[y - 1].dataset.country) {
      if(data[x - 3]?.[y - 2] && !data[x - 3]?.[y - 2].dataset.country
        || (data[x - 3]?.[y - 2] && data[x - 3]?.[y - 2].dataset.country != turn)) data[x - 3]?.[y - 2].classList.toggle("valid");
    };
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].dataset.country){
    if(data[x + 1]?.[y + 2] && !data[x + 1]?.[y + 2].dataset.country) {
      if(data[x + 2]?.[y + 3] && !data[x + 2]?.[y + 3].dataset.country
        || (data[x + 2]?.[y + 3] && data[x + 2]?.[y + 3].dataset.country != turn)) data[x + 2]?.[y + 3].classList.toggle("valid");
    };
    if(data[x - 1]?.[y + 2] && !data[x - 1]?.[y + 2].dataset.country) {
      if(data[x - 2]?.[y + 3] && !data[x - 2]?.[y + 3].dataset.country
        || (data[x - 2]?.[y + 3] && data[x - 2]?.[y + 3].dataset.country != turn)) data[x - 2]?.[y + 3].classList.toggle("valid");
    };
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].dataset.country){
    if(data[x + 1]?.[y - 2] && !data[x + 1]?.[y - 2].dataset.country) {
      if(data[x + 2]?.[y - 3] && !data[x + 2]?.[y - 3].dataset.country
        || (data[x + 2]?.[y - 3] && data[x + 2]?.[y - 3].dataset.country != turn)) data[x + 2]?.[y - 3].classList.toggle("valid");
    };
    if(data[x - 1]?.[y - 2] && !data[x - 1]?.[y - 2].dataset.country) {
      if(data[x - 2]?.[y - 3] && !data[x - 2]?.[y - 3].dataset.country
        || (data[x - 2]?.[y - 3] && data[x - 2]?.[y - 3].dataset.country != turn)) data[x - 2]?.[y - 3].classList.toggle("valid");
    };
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function cannonValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

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
      if (rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")) rightCheck.classList.toggle("valid");
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
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
      if (rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")) rightCheck.classList.toggle("valid");
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
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
      if (rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")) rightCheck.classList.toggle("valid");
      break;
    } ; //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
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
      if (rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")) rightCheck.classList.toggle("valid");
      break;
    }  //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
    i++;
  }

  if([0, 7].includes(x) && y == 3 && data[x + 1][y + 1].dataset.country && !data[x + 1][y + 1].classList.contains("cannon")){
    const rightCheck = data[x + 2]?.[y + 2];
    if (!rightCheck.dataset.country 
      || (rightCheck && rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")))  rightCheck.classList.toggle("valid");
  }
  else if([0, 7].includes(x) && y == 5 && data[x + 1][y - 1].dataset.country && !data[x + 1][y - 1].classList.contains("cannon")){
    const rightCheck = data[x + 2]?.[y - 2];
    if (!rightCheck.dataset.country 
      || (rightCheck && rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")))  rightCheck.classList.toggle("valid");
  }
  else if([2, 9].includes(x) && y == 3 && data[x - 1][y + 1].dataset.country && !data[x - 1][y + 1].classList.contains("cannon")){
    const rightCheck = data[x - 2]?.[y + 2];
    if (!rightCheck.dataset.country 
      || (rightCheck && rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")))  rightCheck.classList.toggle("valid");
  }
  else if([2, 9].includes(x) && y == 5 && data[x - 1][y - 1].dataset.country && !data[x - 1][y - 1].classList.contains("cannon")){
    const rightCheck = data[x - 2]?.[y - 2];
    if (!rightCheck.dataset.country 
      || (rightCheck && rightCheck.dataset.country != turn && !rightCheck.classList.contains("cannon")))  rightCheck.classList.toggle("valid");
  } //궁성에 있다면 대각선 이동 가능!
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function kingValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if (([0, 2, 7, 9].includes(x) && [3, 5].includes(y)) || ([1, 8].includes(x) && y == 4)){
    [1, 0, -1].forEach((i) => {
      [1, 0, -1].forEach((j) => {
        const rightCheck = data[x + i]?.[y + j];
        if(rightCheck && rightCheck.classList.contains("house") && !(i == 0 && j == 0)
        && (!rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn))){
          rightCheck.classList.toggle("valid");
        }
      })
    })
    beforeClickedPiece = _this; 
    return; //궁성에서의 궁 위치에 따라 대각선으로 이동할수도, 못할수도 있다!
  }
  [1, 0, -1].forEach((i) => {
    [1, 0, -1].forEach((j) => {
      const rightCheck = data[x + i]?.[y + j];
      if(rightCheck && rightCheck.classList.contains("house") && Math.abs(i) != Math.abs(j)
      && (!rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn))){
        rightCheck.classList.toggle("valid");
      }
    })
  })
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function scholarValidMove(_this){
  if (_this.dataset.country != turn) return; //자기가 둘 차례가 아니면 클릭 금지.
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if (([0, 2, 7, 9].includes(x) && [3, 5].includes(y)) || ([1, 8].includes(x) && y == 4)){
    [1, 0, -1].forEach((i) => {
      [1, 0, -1].forEach((j) => {
        const rightCheck = data[x + i]?.[y + j];
        if(rightCheck && rightCheck.classList.contains("house") && !(i == 0 && j == 0)
        && (!rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn))){
          rightCheck.classList.toggle("valid");
        }
      })
    })
    beforeClickedPiece = _this; 
    return; 
  }
  [1, 0, -1].forEach((i) => {
    [1, 0, -1].forEach((j) => {
      const rightCheck = data[x + i]?.[y + j];
      if(rightCheck && rightCheck.classList.contains("house") && Math.abs(i) != Math.abs(j)
      && (!rightCheck.dataset.country || (rightCheck && rightCheck.dataset.country != turn))){
        rightCheck.classList.toggle("valid");
      }
    })
  }) //왕과 완벽하게 동일하게 움직인다.
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function whichMoveToSelect(){
  if(this.classList.contains("valid")){
    data.flat().forEach((e) => {e.classList.remove("valid");})
    let classArr = []; //이동하는 기물이 가진 class 저장(기물 이름만 저장하기 위해 만든 임시 array)
    beforeClickedPiece.classList.forEach((e) => classArr.push(e));
    classArr = classArr.filter((c) => c != "house"); //궁성 class는 냅두고 옮겨야 함.
    
    if (this.dataset.country == "cho") {
      this.classList.forEach((e) => {
        if(e != "house") diePiecesNameForCho.push(e);
      });
    }
    else if (this.dataset.country == "han") {
      this.classList.forEach((e) => {
        if(e != "house") diePiecesNameForHan.push(e);
      });
    }
    
    if (this.classList.contains("house")){
      this.classList.value = "house";
    }
    else{
      this.classList = "";
    } //만약 이동 칸에 상대 기물 있었으면 먹어치우기.
    classArr.forEach((e) => {
      this.classList.add(e);
    })
    
    this.setAttribute("data-country", beforeClickedPiece.dataset.country);
    beforeClickedPiece.dataset.country = "";
    beforeClickedPiece.textContent = "";
    if(beforeClickedPiece.classList.contains("house")){
      beforeClickedPiece.classList.value = "house";
    }
    else{
      beforeClickedPiece.classList.value = "";
    }
    console.log(turn);
    if (isCheck(turn)) alert("장군!"); //장군이면 일단 장군 경고창이 나오게 하였음. 장군판단하는 부분 추후에 코드 추가
    
    if (turn == "cho") turn = "han";
    else turn = "cho"; //다른 턴으로 넘겨주는 작업
    return;
  } //만약에 빈칸에 기물을 클릭하는 행동이거나 먹는 행동이였으면, 이동하고 종료.
  
  const _this = this; //함수 안으로 this전달하기 위해서 선언
  if (this.classList.contains("car")) {carValidMove(_this); return;}
  if (this.classList.contains("soldier")) {soldierValidMove(_this); return;}
  if (this.classList.contains("horse"))  {horseValidMove(_this); return;}
  if (this.classList.contains("elephant")) {elephantValidMove(_this); return;}
  if (this.classList.contains("cannon"))  {cannonValidMove(_this); return;}
  if (this.classList.contains("king")) {kingValidMove(_this); return;}
  if (this.classList.contains("scholar")) {scholarValidMove(_this); return;} //그게 아니라면 움직일 수 있는 칸 표시해주기.
}

export {whichMoveToSelect};