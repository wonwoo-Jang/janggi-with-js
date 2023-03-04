import { useCallback, useEffect, useState } from 'react';

import { Piece } from '@models/Piece';
import { Position } from '@models/Position';

import { Board, CountryType, PieceType } from '@customTypes/janggiTypes';

import {
  ROW_NUM,
  TABLE_SETTING_OPTIONS,
  TABLE_SETTING_POSITION,
  INIT_PIECES_INFO,
  INITIAL_BOARD,
} from '@utils/janggi/constants';
import { pieceOccupyingTile } from '@utils/janggi/rules/generalRules';
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
import ScoreBoard from './ScoreBoard';

import styles from './Referee.module.scss';

// in charge of overall game process
export default function Referee() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [tableSetting, setTableSetting] = useState<PieceType[]>([]);
  const [playedCount, setPlayedCount] = useState<number>(0);
  const [turn, setTurn] = useState<CountryType>(CountryType.HAN);
  const [showCheckModal, setShowCheckModal] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [choScoreBoard, setChoScoreBoard] = useState<{ deadOpponentPieces: Piece[]; score: number }>({
    deadOpponentPieces: [],
    score: 28.5,
  });
  const [hanScoreBoard, setHanScoreBoard] = useState<{ deadOpponentPieces: Piece[]; score: number }>({
    deadOpponentPieces: [],
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

  const moveTemporarily = (movingPiece: Piece, destination: Position, board: Board) => {
    board[ROW_NUM - movingPiece.position.x][movingPiece.position.y - 1].piece = null; // move from original position
    board[ROW_NUM - destination.x][destination.y - 1].piece = movingPiece; // to destination
    movingPiece.setPosition(destination);
  };

  // 이동 가능 위치를 판별하기 위해 임시로 생성한 boardPreview에서 장군이 나오는지 확인
  const checkKingCheckPreview = (pieces: Piece[], board: Board): boolean => {
    for (const piece of pieces) {
      const possibleMoves = getPossibleMoves(piece, board);
      if (isCheck(piece, possibleMoves, board)) return true;
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

  const movePiece = (piece: Piece, destination: Position, attackedPiece: Piece | null) => {
    piece.setPosition(destination); // move selectedPiece to the destination
    const updatedPieces = pieces.reduce((result, p) => {
      // remove attacked piece (filter alive pieces)
      if (attackedPiece && p.isSamePiece(attackedPiece)) {
        if (attackedPiece.country === CountryType.CHO) {
          const deadOpponentPieces = [...hanScoreBoard.deadOpponentPieces, attackedPiece];
          setChoScoreBoard(prev => ({ ...prev, score: prev.score - attackedPiece.point }));
          setHanScoreBoard(prev => ({ ...prev, deadOpponentPieces }));
        } else {
          const deadOpponentPieces = [...choScoreBoard.deadOpponentPieces, attackedPiece];
          setHanScoreBoard(prev => ({ ...prev, score: prev.score - attackedPiece.point }));
          setChoScoreBoard(prev => ({ ...prev, deadOpponentPieces }));
        }
      } else result.push(p);
      return result;
    }, [] as Piece[]);

    setPieces(updatedPieces);
    setPlayedCount(prev => prev + 1);
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

  const changeTurn = (newTurn?: CountryType) => {
    if (newTurn) setTurn(newTurn);
    else setTurn(prev => (prev === CountryType.CHO ? CountryType.HAN : CountryType.CHO));
  };

  // update board depending on the pieces
  const updateBoard = useCallback(
    (pieces: Piece[]): Board => {
      const newBoard: Board = board.map(row => {
        return row.map(tile => {
          const piece = pieces.find(p => p.position.isSamePosition(tile.position));
          tile.piece = piece ?? null;
          return tile;
        });
      });

      setBoard(newBoard);
      return newBoard;
    },
    [pieces],
  );

  const checkGameEnd = (): boolean => {
    if (isCheckmate() || choScoreBoard.score < 10 || hanScoreBoard.score < 10) {
      setIsGameEnd(true);
      return true;
    } else if (playedCount > 200) {
      changeTurn(choScoreBoard.score < hanScoreBoard.score ? CountryType.HAN : CountryType.CHO);
      setIsGameEnd(true);
      return true;
    }
    return false;
  };

  const updateGame = useCallback(() => {
    if (pieces.length < 1) return;
    const newBoard = updateBoard(pieces);
    updatePossibleAndBlockedMoves(newBoard);
    if (checkGameEnd()) return;
    detectCheck(newBoard);
    changeTurn();
  }, [pieces]);

  const initializePieces = useCallback(() => {
    if (tableSetting.length < 1) return;

    // TODO: determine country randomly
    const initialPieces = INIT_PIECES_INFO.reduce((pieces, info) => {
      for (const y of info.y) {
        for (const country of [CountryType.CHO, CountryType.HAN]) {
          const x = country === CountryType.CHO ? info.x : ROW_NUM + 1 - info.x;
          pieces.push(new Piece(info.type, new Position(x, y), country, `images/${country}_${info.type}.png`));
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
    updateGame();
  }, [updateGame]);

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
      <div className={styles.boards}>
        <ScoreBoard scoreBoard={hanScoreBoard} />
        <JanggiBoard
          board={board}
          turn={turn}
          showCheckModal={showCheckModal}
          tableSetting={tableSetting}
          setTableSetting={setTableSetting}
          movePiece={movePiece}
        />
        <ScoreBoard scoreBoard={choScoreBoard} />
      </div>
      <div className={styles.gameOptions}>
        <div className={styles.playedCount}>{playedCount}수</div>
        <button
          className={styles.pass}
          onClick={() => {
            alert(`${turn} 한 수 쉼!`);
            setPlayedCount(prev => prev + 1);
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
