import { Dispatch, SetStateAction } from 'react';

import { CountryType } from '@customTypes/janggiTypes';

import { TABLE_SETTING_OPTIONS } from '@utils/janggi/constants';

import styles from './TableSettingModal.module.scss';

interface TableSettingModalProps {
  myCountry: CountryType;
  opponentTableSetting: string[] | null;
  setTableSetting: Dispatch<SetStateAction<string[]>>;
}

export default function TableSettingModal({
  myCountry,
  opponentTableSetting,
  setTableSetting,
}: TableSettingModalProps) {
  return (
    <div className={styles.tableSettingModal}>
      <div className={styles.message}>
        <div className={styles.header}>
          <h3>상차림 선택</h3>
          <div className={styles.opponentOption}>
            {TABLE_SETTING_OPTIONS[0].map((p, i) => (
              <div style={{ backgroundImage: `url('images/${CountryType.HAN}_${p}.png')` }} key={i} />
            ))}
          </div>
        </div>
        <span>대국 시작시 상/마의 위치를 선택합니다.</span>
      </div>
      <div className={styles.options}>
        {TABLE_SETTING_OPTIONS.map((option, i) => (
          <div className={styles.option} key={i}>
            {option.map(p => (
              <div
                className={styles.piece}
                style={{ backgroundImage: `url('images/${myCountry}_${p}.png')` }}
                key={`${p}${i}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button>확인</button>
    </div>
  );
}
