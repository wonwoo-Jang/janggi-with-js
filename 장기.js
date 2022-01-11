import { piecesNameSetting, boardContentSetting, determinePiecesCountry, addHouseClass } from "./initialSettings.js";

const $table = document.querySelector("table");
const data = [];
let beforeClickedPiece; //이전에 클릭된 기물이 저장되는 곳(td를 저장)
let myCountry = "cho"; //내 나라(초, 한) 설정 (유저가 직접 설정하는 거 나중에 추가)

function carValidMove(_this) {
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  let i = 1;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex + i];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex - i];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex + i]?.[_this.cellIndex];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex - i]?.[_this.cellIndex];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function soldierValidMove(_this){
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  let upOrDown = 1;
  if(_this.classList.contains(myCountry)){
    upOrDown = -1;
  }
  let rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex + 1];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex - 1];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[_this.parentNode.rowIndex + upOrDown]?.[_this.cellIndex];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function horseValidMove(_this){
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].textContent){
    if(data[x + 2]?.[y + 1] && !data[x + 2]?.[y + 1].textContent) data[x + 2]?.[y + 1].classList.toggle("valid");
    if(data[x + 2]?.[y - 1] && !data[x + 2]?.[y - 1].textContent) data[x + 2]?.[y - 1].classList.toggle("valid");
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].textContent){
    if(data[x - 2]?.[y + 1] && !data[x - 2]?.[y + 1].textContent) data[x - 2]?.[y + 1].classList.toggle("valid");
    if(data[x - 2]?.[y - 1] && !data[x - 2]?.[y - 1].textContent) data[x - 2]?.[y - 1].classList.toggle("valid");
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].textContent){
    if(data[x + 1]?.[y + 2] && !data[x + 1]?.[y + 2].textContent) data[x + 1]?.[y + 2].classList.toggle("valid");
    if(data[x - 1]?.[y + 2] && !data[x - 1]?.[y + 2].textContent) data[x - 1]?.[y + 2].classList.toggle("valid");
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].textContent){
    if(data[x + 1]?.[y - 2] && !data[x + 1]?.[y - 2].textContent) data[x + 1]?.[y - 2].classList.toggle("valid");
    if(data[x - 1]?.[y - 2] && !data[x - 1]?.[y - 2].textContent) data[x - 1]?.[y - 2].classList.toggle("valid");
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function elephantValidMove(_this){
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = _this.parentNode.rowIndex;
  const y = _this.cellIndex;
  if(data[x + 1]?.[y] && !data[x + 1]?.[y].textContent){
    if(data[x + 2]?.[y + 1] && !data[x + 2]?.[y + 1].textContent) {
      if(data[x + 3]?.[y + 2] && !data[x + 3]?.[y + 2].textContent) data[x + 3]?.[y + 2].classList.toggle("valid");
    };
    if(data[x + 2]?.[y - 1] && !data[x + 2]?.[y - 1].textContent) {
      if(data[x + 3]?.[y - 2] && !data[x + 3]?.[y - 2].textContent) data[x + 3]?.[y - 2].classList.toggle("valid");
    };
  }
  if(data[x - 1]?.[y] && !data[x - 1]?.[y].textContent){
    if(data[x - 2]?.[y + 1] && !data[x - 2]?.[y + 1].textContent) {
      if(data[x - 3]?.[y + 2] && !data[x - 3]?.[y + 2].textContent) data[x - 3]?.[y + 2].classList.toggle("valid");
    };
    if(data[x - 2]?.[y - 1] && !data[x - 2]?.[y - 1].textContent) {
      if(data[x - 3]?.[y - 2] && !data[x - 3]?.[y - 2].textContent) data[x - 3]?.[y - 2].classList.toggle("valid");
    };
  }
  if(data[x]?.[y + 1] && !data[x]?.[y + 1].textContent){
    if(data[x + 1]?.[y + 2] && !data[x + 1]?.[y + 2].textContent) {
      if(data[x + 2]?.[y + 3] && !data[x + 2]?.[y + 3].textContent) data[x + 2]?.[y + 3].classList.toggle("valid");
    };
    if(data[x - 1]?.[y + 2] && !data[x - 1]?.[y + 2].textContent) {
      if(data[x - 2]?.[y + 3] && !data[x - 2]?.[y + 3].textContent) data[x - 2]?.[y + 3].classList.toggle("valid");
    };
  }
  if(data[x]?.[y - 1] && !data[x]?.[y -1].textContent){
    if(data[x + 1]?.[y - 2] && !data[x + 1]?.[y - 2].textContent) {
      if(data[x + 2]?.[y - 3] && !data[x + 2]?.[y - 3].textContent) data[x + 2]?.[y - 3].classList.toggle("valid");
    };
    if(data[x - 1]?.[y - 2] && !data[x - 1]?.[y - 2].textContent) {
      if(data[x - 2]?.[y - 3] && !data[x - 2]?.[y - 3].textContent) data[x - 2]?.[y - 3].classList.toggle("valid");
    };
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function cannonValidMove(_this){
  if (beforeClickedPiece != _this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  let i = 1;
  let pivot = false;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex + i];
    if (!rightCheck) break;
    if (!pivot && rightCheck.textContent && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.textContent) break; //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex]?.[_this.cellIndex - i];
    if (!rightCheck) break;
    if (!pivot && rightCheck.textContent && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.textContent) break; //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex + i]?.[_this.cellIndex];
    if (!rightCheck) break;
    if (!pivot && rightCheck.textContent && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.textContent) break; //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
    i++;
  }
  i = 1;
  pivot = false;
  while (true){
    const rightCheck = data[_this.parentNode.rowIndex - i]?.[_this.cellIndex];
    if (!rightCheck) break;
    if (!pivot && rightCheck.textContent && !rightCheck.classList.contains("cannon")){
      pivot = true;
      i++;
      continue;
    } //처음 만나는 장애물은 발판이다.
    if (rightCheck.textContent) break; //두번째로 만나는 장애물까지 이동가능
    if(pivot){
      rightCheck.classList.toggle("valid");
    }
    i++;
  }
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function kingValidMove(_this){
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
        if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && !(i == 0 && j == 0)){
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
      if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && Math.abs(i) != Math.abs(j)){
        rightCheck.classList.toggle("valid");
      }
    })
  })
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function scholarValidMove(_this){
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
        if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && !(i == 0 && j == 0)){
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
      if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && Math.abs(i) != Math.abs(j)){
        rightCheck.classList.toggle("valid");
      }
    })
  }) //왕과 완벽하게 동일하게 움직인다.
  beforeClickedPiece = _this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function whichMoveToSelect(){
  if(this.classList.contains("valid")){
    data.flat().forEach((e) => {e.classList.remove("valid");})
    this.classList.add(beforeClickedPiece.classList[0], beforeClickedPiece.classList[1]); //지금은 2개(기물 정보, 나라) 추후 class 추가되면 이부분 수정! + 궁성을 표시하는 house class도 생각해줘야 한다!
    this.textContent = beforeClickedPiece.textContent;
    if(beforeClickedPiece.classList.contains("house")){
      beforeClickedPiece.classList.value = "house";
      beforeClickedPiece.textContent = "";
      return;
    }
    beforeClickedPiece.classList.value = "";
    beforeClickedPiece.textContent = "";
    return;
  } //만약에 빈칸에 기물을 클릭하는 행동이였으면, 이동하고 종료.
  
  const _this = this; //함수 안으로 this전달하기 위해서 선언
  if (this.classList.contains("car")) {carValidMove(_this); return;}
  if (this.classList.contains("soldier")) {soldierValidMove(_this); return;}
  if (this.classList.contains("horse"))  {horseValidMove(_this); return;}
  if (this.classList.contains("elephant")) {elephantValidMove(_this); return;}
  if (this.classList.contains("cannon"))  {cannonValidMove(_this); return;}
  if (this.classList.contains("king")) {kingValidMove(_this); return;}
  if (this.classList.contains("scholar")) {scholarValidMove(_this); return;} //그게 아니라면 움직일 수 있는 칸 표시해주기.
}

for(let i = 0; i < 10; i++){
  const row = [];
  const $tr = document.createElement("tr");
  for (let j = 0; j < 9; j++){
    const $td = document.createElement("td");
    piecesNameSetting(i, j, $td);
    determinePiecesCountry(i, j, $td, myCountry);
    boardContentSetting($td);
    addHouseClass(i, j, $td);
    $td.addEventListener("click", whichMoveToSelect);
    $tr.appendChild($td);
    row.push($td);
  }
  data.push(row);
  $table.appendChild($tr);
}