export class janggiPieces{
  constructor(data, nowR, nowC){
    this.data = data;
    this.nowC = nowC;
    this.nowR = nowR;
  }
}

class car extends janggiPieces{
  constructor(data, nowR, nowC){
    super(data, nowR, nowC);
  }
  canMove(goToR, gotToC){
    if(goToR == this.nowR || gotToC == this.nowC){
      return true;
    } //class를 어떻게 구성해야 할지 고민해보자.
  }
}