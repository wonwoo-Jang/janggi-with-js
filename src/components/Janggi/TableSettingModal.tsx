import { Dispatch, SetStateAction } from 'react';

import { CountryType, PieceType } from '@customTypes/janggiTypes';

import { TABLE_SETTING_OPTIONS } from '@utils/janggi/constants';

import styles from './TableSettingModal.module.scss';

interface TableSettingModalProps {
  myCountry: CountryType;
  opponentTableSetting: PieceType[] | null;
  setTableSetting: Dispatch<SetStateAction<PieceType[]>>;
}

export default function TableSettingModal({
  myCountry,
  opponentTableSetting,
  setTableSetting,
}: TableSettingModalProps) {
  const selectTableSetting = (tableSetting: PieceType[]) => {
    console.log(tableSetting);
    setTableSetting(tableSetting);
  };

  return (
    <div className={styles.tableSettingModal}>
      <div className={styles.message}>
        <div className={styles.header}>
          <h3>상차림 선택</h3>
          {opponentTableSetting && (
            <div className={styles.opponentOption}>
              {opponentTableSetting.map((p, i) => (
                <div style={{ backgroundImage: `url('images/${CountryType.HAN}_${p}.png')` }} key={i} />
              ))}
            </div>
          )}
        </div>
        <span>대국 시작시 상/마의 위치를 선택합니다.</span>
      </div>
      <div className={styles.options}>
        {TABLE_SETTING_OPTIONS.map((option, i) => (
          <div className={styles.option} onClick={() => selectTableSetting(option)} key={i}>
            {option.map((p, j) => (
              <div
                className={styles.piece}
                style={{ backgroundImage: `url('images/${myCountry}_${p}.png')` }}
                key={`${p}${i}-${j}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button>확인</button>
    </div>
  );
}
