import { useCallback, useEffect, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType, TileI } from '@customTypes/janggiTypes';

import { ROW_NUM, COLUMNS, ROWS, TABLE_SETTING_OPTIONS } from '@utils/janggi/constants';
import { isTileOccupiedByMyCountry, pieceOccupyingTile } from '@utils/janggi/rules/generalRules';
import {
  getPossibleCannonMoves,
  getPossibleCarMoves,
  getPossibleElephantMoves,
  getPossibleHorseMove,
  getPossibleKingMoves,
  getPossibleScholarMoves,
  getPossibleSoldierMoves,
} from '@utils/janggi/rules/pieceRules';

import JanggiBoard from './JanggiBoard';

import styles from './Referee.module.scss';

const initialBoard = ROWS.reduce((board, x) => {
  const newRow = COLUMNS.reduce((row, y) => {
    row.push({ position: new Position(x, y), piece: null, highlight: false });
    return row;
  }, [] as TileI[]);
  board.push(newRow);
  return board;
}, [] as Board);

// in charge of overall game progress
export default function Referee() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [tableSetting, setTableSetting] = useState<PieceType[]>([]);
  const [turn, setTurn] = useState<CountryType>(CountryType.HAN);
  const [showCheckModal, setShowCheckModal] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [choScoreBoard, setChoScoreBoard] = useState<{ deadPieces: Piece[]; score: number }>({
    deadPieces: [],
    score: 28.5,
  });
  const [hanScoreBoard, setHanScoreBoard] = useState<{ deadPieces: Piece[]; score: number }>({
    deadPieces: [],
    score: 30,
  });

  const getPossibleMoves = (piece: Piece, board: Board): Position[] => {
    switch (piece.type) {
      case PieceType.SOLDIER:
        return getPossibleSoldierMoves(piece, board);
      case PieceType.HORSE:
        return getPossibleHorseMove(piece, board);
      case PieceType.ELEPHANT:
        return getPossibleElephantMoves(piece, board);
      case PieceType.CANNON:
        return getPossibleCannonMoves(piece, board);
      case PieceType.CAR:
        return getPossibleCarMoves(piece, board);
      case PieceType.SCHOLAR:
        return getPossibleScholarMoves(piece, board);
      case PieceType.KING:
        return getPossibleKingMoves(piece, board);
      default:
        return [];
    }
  };

  const moveTemporarily = (movingPiece: Piece, destination: Position, board: Board) => {
    board[ROW_NUM - movingPiece.position.x][movingPiece.position.y - 1].piece = null; // move from original position
    board[ROW_NUM - destination.x][destination.y - 1].piece = movingPiece; // to destination
    movingPiece.setPosition(destination);
  };

  const revertTemporaryMove = (
    movingPiece: Piece,
    originalPosition: Position,
    originalPiece: Piece | null,
    board: Board,
  ) => {
    board[ROW_NUM - movingPiece.position.x][movingPiece.position.y - 1].piece = originalPiece; // put the original piece back
    board[ROW_NUM - originalPosition.x][originalPosition.y - 1].piece = movingPiece; // revert moved position
    movingPiece.setPosition(originalPosition);
  };

  // 이동 가능 위치를 판별하기 위해 임시로 생성한 boardPreview에서 장군이 나오는지 확인
  const checkKingCheckPreview = (pieces: Piece[], board: Board): boolean => {
    for (const piece of pieces) {
      const poss = getPossibleMoves(piece, board);
      if (isCheck(piece, poss, board)) return true;
    }
    return false;
  };

  // 장군이라서 못가는 자리까지 전부 제외한 이동 가능 위치
  const getExactPossibleMoves = (piece: Piece, board: Board): { possible: Position[]; blocked: Position[] } => {
    const possibleMoves = getPossibleMoves(piece, board);
    const exactPossibleMoves: Position[] = [];
    const blockedMoves: Position[] = [];

    // 나중에 piece도 제대로 클론되도록 변경
    const opponents: Piece[] = pieces.filter(p => p.isOpponent(piece));
    const boardPreview: Board = board.map(row => [...row.map(tile => ({ ...tile }))]); // deep copy (but piece and position are still the original one)
    const movingPiece = piece.clone();

    for (const destination of possibleMoves) {
      const opponent: Piece | null = pieceOccupyingTile(destination, boardPreview); // opponent at destination (if exists)
      moveTemporarily(movingPiece, destination, boardPreview);
      const check = checkKingCheckPreview(
        (opponent && opponents.filter(op => !op.isSamePiece(opponent))) || opponents,
        boardPreview,
      );
      check ? blockedMoves.push(destination) : exactPossibleMoves.push(destination);
      revertTemporaryMove(movingPiece, piece.position, opponent, boardPreview);
    }

    return { possible: exactPossibleMoves, blocked: blockedMoves };
  };

  // check if the new position is belongs to possible moves
  const isValidMove = (newPosition: Position, piece: Piece, board: Board): boolean => {
    if (isTileOccupiedByMyCountry(piece.country, newPosition, board)) return false;
    const isValid = piece.possibleMoves.some(p => p.isSamePosition(newPosition));
    return isValid;
  };

  const movePiece = (piece: Piece, newPosition: Position, attackedPiece: Piece | null) => {
    piece.setPosition(newPosition); // move selectedPiece to the new position
    const updatedPieces = pieces.reduce((result, p) => {
      // remove attacked piece (filter alive pieces)
      if (attackedPiece && p.isSamePiece(attackedPiece)) {
        if (attackedPiece.country === CountryType.CHO) {
          const deadPieces = [...choScoreBoard.deadPieces, attackedPiece];
          setChoScoreBoard(prev => ({ score: prev.score - attackedPiece.point, deadPieces }));
        } else {
          const deadPieces = [...hanScoreBoard.deadPieces, attackedPiece];
          setHanScoreBoard(prev => ({ score: prev.score - attackedPiece.point, deadPieces }));
        }
      } else result.push(p);
      return result;
    }, [] as Piece[]);

    setPieces(updatedPieces);
  };

  const resetCheck = () => {
    pieces.map(p => (p.isCheck = false));
  };

  // check if the piece has checked the king
  const isCheck = (piece: Piece, possibleMoves: Position[], board: Board): boolean => {
    for (const position of possibleMoves) {
      const opponent: Piece | null = pieceOccupyingTile(position, board);
      if (opponent && opponent.isOpponent(piece) && opponent.isKing()) return true;
    }
    return false;
  };

  // check if the king is checked
  const detectCheck = (newBoard: Board) => {
    resetCheck(); // 장군 새로 확인하기 전에 이전에 있던 값들 초기화
    let check = false;
    for (const piece of pieces) {
      if (isCheck(piece, piece.possibleMoves, newBoard)) {
        piece.isCheck = true;
        check = true;
      }
    }
    if (check) {
      setShowCheckModal(true);
      setTimeout(() => {
        setShowCheckModal(false);
      }, 1500);
    }
  };

  const isCheckmate = (): boolean => {
    return pieces.every(p => p.country === turn || p.possibleMoves.length === 0);
  };

  // update all possible moves depending on the board
  const updatePossibleAndBlockedMoves = (newBoard: Board) => {
    pieces.map(p => {
      const { possible, blocked } = getExactPossibleMoves(p, newBoard);
      p.possibleMoves = possible;
      p.blockedMoves = blocked;
      return p;
    });
  };

  const changeTurn = () => {
    setTurn(prev => (prev === CountryType.CHO ? CountryType.HAN : CountryType.CHO));
  };

  // update board depending on the pieces
  const updateBoard = useCallback(() => {
    if (pieces.length < 1) return;

    const updatedBoard = board.map(row => {
      return row.map(tile => {
        const piece = pieces.find(p => p.position.isSamePosition(tile.position));
        tile.piece = piece ?? null;
        // tile.highlight = false;
        return tile;
      });
    });

    setBoard(updatedBoard);
    updatePossibleAndBlockedMoves(updatedBoard);
    if (isCheckmate()) {
      setIsGameEnd(true);
    } else {
      detectCheck(updatedBoard);
      changeTurn();
    }
  }, [pieces]);

  const initializePieces = useCallback(() => {
    if (tableSetting.length < 1) return;

    const TABLE_SETTING_POSITION = [2, 3, 7, 8];

    const initPiecesInfo = [
      { type: PieceType.SOLDIER, x: 4, y: [1, 3, 5, 7, 9] },
      { type: PieceType.CANNON, x: 3, y: [2, 8] },
      { type: PieceType.KING, x: 2, y: [5] },
      { type: PieceType.CAR, x: 1, y: [1, 9] },
      { type: PieceType.SCHOLAR, x: 1, y: [4, 6] },
    ];

    // TODO: determine country randomly
    const initialPieces = initPiecesInfo.reduce((pieces, info) => {
      for (const y of info.y) {
        for (const country of [CountryType.CHO, CountryType.HAN]) {
          pieces.push(
            new Piece(
              info.type,
              new Position(country === CountryType.CHO ? info.x : ROW_NUM + 1 - info.x, y),
              country,
              `images/${country}_${info.type}.png`,
            ),
          );
        }
      }
      return pieces;
    }, [] as Piece[]);

    const tableSettingOfEachCountry = [
      { country: CountryType.CHO, tableSetting: tableSetting },
      { country: CountryType.HAN, tableSetting: TABLE_SETTING_OPTIONS[0].reverse() },
    ];

    tableSettingOfEachCountry.map(info => {
      info.tableSetting.map((pieceType, i) => {
        initialPieces.push(
          new Piece(
            pieceType,
            new Position(info.country === CountryType.CHO ? 1 : 10, TABLE_SETTING_POSITION[i]),
            info.country,
            `images/${info.country}_${pieceType}.png`,
          ),
        );
      });
    });

    setPieces(initialPieces);
  }, [tableSetting]);

  useEffect(() => {
    updateBoard();
  }, [updateBoard]);

  useEffect(() => {
    initializePieces();
  }, [initializePieces]);

  useEffect(() => {
    if (isGameEnd) {
      alert(`${turn} win!`);
    }
  }, [isGameEnd]);

  return (
    <div className={styles.janggi}>
      <div className={styles.scoreBoard}>
        <span className={styles.score}>{hanScoreBoard.score}</span>
        <div className={styles.deadPieces}>
          {choScoreBoard.deadPieces.map((p, i) => (
            <div
              className={`${styles.deadPiece} 
          ${[PieceType.SCHOLAR, PieceType.SOLDIER].includes(p.type) && styles.small}
          `}
              style={{ backgroundImage: `url(${p.image})` }}
              key={i}
            />
          ))}
        </div>
      </div>
      <JanggiBoard
        board={board}
        turn={turn}
        showCheckModal={showCheckModal}
        tableSetting={tableSetting}
        setTableSetting={setTableSetting}
        isValidMove={isValidMove}
        movePiece={movePiece}
      />
      <div className={styles.scoreBoard}>
        <span className={styles.score}>{choScoreBoard.score}</span>
        <div className={styles.deadPieces}>
          {hanScoreBoard.deadPieces.map((p, i) => (
            <div
              className={`${styles.deadPiece} 
          ${[PieceType.SCHOLAR, PieceType.SOLDIER].includes(p.type) && styles.small}
          `}
              style={{ backgroundImage: `url(${p.image})` }}
              key={i}
            />
          ))}
        </div>
      </div>
      <div className={styles.gameOptions}>
        <button
          className={styles.pass}
          onClick={() => {
            alert(`${turn} 한 수 쉼!`);
            changeTurn();
          }}
        >
          <span>한 수 쉼</span>
        </button>
        <button
          className={styles.giveUp}
          onClick={() => {
            changeTurn();
            setIsGameEnd(true);
          }}
        >
          <span>기권</span>
        </button>
      </div>
    </div>
  );
}
