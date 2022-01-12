import { piecesNameSetting, boardContentSetting, determinePiecesCountry, addHouseClass } from "./initialSettings.js";
import { whichMoveToSelect } from "./aboutMove.js";

const $table = document.querySelector("table");
const data = [];

let turn = "cho"; //cho부터 시작해서 한 수 씩 둔다
let myCountry = "cho"; //내 나라(초, 한) 설정 (유저가 직접 설정하는 거 나중에 추가)

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

export {data, myCountry, turn};