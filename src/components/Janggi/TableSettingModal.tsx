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
        <h3>상차림 선택</h3>
        <span>대국 시작시 상/마의 위치를 선택합니다.</span>
      </div>
      <div className={styles.options}>
        {TABLE_SETTING_OPTIONS.map((option, i) => (
          <div className={styles.option} key={i}>
            {option.map(type => (
              <div
                className={styles.piece}
                style={{ backgroundImage: `url('images/${myCountry}_${type}.png')` }}
                key={`${type}${i}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button>확인</button>
    </div>
  );
}
