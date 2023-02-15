export type Country = 'cho' | 'han';

export const CountryKor = (country: Country) => (country === 'cho' ? '초' : '한');

export type PieceName = 'cannon' | 'car' | 'elephant' | 'king' | 'scholar' | 'soldier';

export interface Piece {
  name: PieceName;
  country: Country;
  score: number;
  move(): void;
  check(): void;
}
