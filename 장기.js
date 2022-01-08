import { boardClassSetting, boardContentSetting } from "./initialSettings.js";
import { janggiPieces } from "./janggiPieces.js";

const $table = document.querySelector("table");
const data = [];
let beforeClickedPiece; //이전에 클릭된 기물이 저장되는 곳(td를 저장)

function carValidMove(){
  if (beforeClickedPiece != this){
    data.flat().forEach((ele, ind) => {
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

}

function horseValidMove(){

}

function elephantValidMove(){

}

function cannonValidMove(){

}

function kingValidMove(){

}

function scholarValidMove(){

}

for(let i = 0; i < 10; i++){
  const row = [];
  const $tr = document.createElement("tr");
  for (let j = 0; j < 9; j++){
    const $td = document.createElement("td");
    boardClassSetting(i, j, $td);
    boardContentSetting($td);
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