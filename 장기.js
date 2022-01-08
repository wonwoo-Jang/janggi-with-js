import { boardClassSetting, boardContentSetting } from "./initialSettings.js";
import { janggiPieces } from "./janggiPieces.js";

const $table = document.querySelector("table");
const data = [];


for(let i = 0; i < 10; i++){
  const row = [];
  const $tr = document.createElement("tr");
  for (let j = 0; j < 9; j++){
    const $td = document.createElement("td");
    boardClassSetting(i, j, $td);
    boardContentSetting($td);
    $tr.appendChild($td);
    row.push($td);
  }
  data.push(row);
  $table.appendChild($tr);
}