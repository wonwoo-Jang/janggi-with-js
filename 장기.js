import { piecesNameSetting, boardContentSetting, determinePiecesCountry, addHouseClass } from "./initialSettings.js";
import { janggiPieces } from "./janggiPieces.js";

const $table = document.querySelector("table");
const data = [];
let beforeClickedPiece; //이전에 클릭된 기물이 저장되는 곳(td를 저장)
let myCountry = "cho"; //내 나라(초, 한) 설정 (유저가 직접 설정하는 거 나중에 추가)

function carValidMove(){
  if (beforeClickedPiece != this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  let i = 1;
  while (true){
    const rightCheck = data[this.parentNode.rowIndex]?.[this.cellIndex + i];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[this.parentNode.rowIndex]?.[this.cellIndex - i];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[this.parentNode.rowIndex + i]?.[this.cellIndex];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  i = 1;
  while (true){
    const rightCheck = data[this.parentNode.rowIndex - i]?.[this.cellIndex + i];
    if (!rightCheck) break;
    if (rightCheck.textContent) break;
    rightCheck.classList.toggle("valid");
    i++;
  }
  beforeClickedPiece = this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function soldierValidMove(){
  if (beforeClickedPiece != this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함

  let upOrDown = 1;
  if(this.classList.contains(myCountry)){
    upOrDown = -1;
  }
  let rightCheck = data[this.parentNode.rowIndex]?.[this.cellIndex + 1];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[this.parentNode.rowIndex]?.[this.cellIndex - 1];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  rightCheck = data[this.parentNode.rowIndex + upOrDown]?.[this.cellIndex];
  if(rightCheck && !rightCheck.textContent){
    rightCheck.classList.toggle("valid");
  }
  beforeClickedPiece = this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function horseValidMove(){

}

function elephantValidMove(){

}

function cannonValidMove(){

}

function kingValidMove(){
  if (beforeClickedPiece != this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = this.parentNode.rowIndex;
  const y = this.cellIndex;
  if (([0, 2, 7, 9].includes(x) && [3, 5].includes(y)) || ([1, 8].includes(x) && y == 4)){
    [1, 0, -1].forEach((i) => {
      [1, 0, -1].forEach((j) => {
        const rightCheck = data[x + i]?.[y + j];
        if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && !(i == 0 && j == 0)){
          rightCheck.classList.toggle("valid");
        }
      })
    })
    beforeClickedPiece = this; 
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
  beforeClickedPiece = this; //이전에 클릭된 기물에 클릭된 td를 저장
}

function scholarValidMove(){
  if (beforeClickedPiece != this){
    data.flat().forEach((ele) => {
      if(ele.classList.contains("valid")) ele.classList.remove("valid");
    })
  } //만약 이전에 클릭된 기물이 아니면, valid를 토글하기 전에 valid를 초기화해줘야 함
  const x = this.parentNode.rowIndex;
  const y = this.cellIndex;
  if (([0, 2, 7, 9].includes(x) && [3, 5].includes(y)) || ([1, 8].includes(x) && y == 4)){
    [1, 0, -1].forEach((i) => {
      [1, 0, -1].forEach((j) => {
        const rightCheck = data[x + i]?.[y + j];
        if(rightCheck && rightCheck.classList.contains("house") && !rightCheck.textContent && !(i == 0 && j == 0)){
          rightCheck.classList.toggle("valid");
        }
      })
    })
    beforeClickedPiece = this; 
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
  beforeClickedPiece = this; //이전에 클릭된 기물에 클릭된 td를 저장
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
    if ($td.classList.contains("car"))  $td.addEventListener("click", carValidMove);
    if ($td.classList.contains("soldier")) $td.addEventListener("click", soldierValidMove);
    if ($td.classList.contains("horse"))  $td.addEventListener("click", horseValidMove);
    if ($td.classList.contains("elephant")) $td.addEventListener("click", elephantValidMove);
    if ($td.classList.contains("cannon"))  $td.addEventListener("click", cannonValidMove);
    if ($td.classList.contains("king")) $td.addEventListener("click", kingValidMove);
    if ($td.classList.contains("scholar")) $td.addEventListener("click", scholarValidMove);
    $tr.appendChild($td);
    row.push($td);
  }
  data.push(row);
  $table.appendChild($tr);
}