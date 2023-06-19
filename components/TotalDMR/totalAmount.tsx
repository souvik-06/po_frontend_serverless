import { useState } from 'react';
import { sortedData } from '../../interface';
import styles from '../DMR/DMR.module.css';
import useTable from '../DMR/listPO/useTable/useTable';

const TotalDMR = ({ poDetails }: { poDetails: sortedData[] }) => {
  let data = poDetails;

  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, 10);
  //console.log(data);
  return (
    <>
      {slice.length ? (
        <div className={styles.table}>
          <div className={`${styles.rowo} ${styles.header}`}>
            <div className={`${styles.cell}`}>PO No</div>
            <div className={`${styles.cell}`}>PO Type</div>
            <div className={`${styles.cell}`}>PO Name</div>
            <div className={`${styles.cell}`}>Project Name</div>
            <div className={`${styles.cell}`}>Total Amount</div>
            <div className={`${styles.cell}`}>Total Raised Amount</div>
          </div>

          {slice?.map((pData: sortedData, index: number) => {
            //console.log();
            return (
              // onClick = {(e) => handlePODetails(`${pData.ponumber}`, e)}
              <div className={styles.rowo} key={index}>
                <div className={`${styles.cell}`} data-title="PO No">
                  {pData.ponumber}
                </div>
                <div className={`${styles.cell}`} data-title="PO Type">
                  {pData.potype}
                </div>
                <div className={`${styles.cell}`} data-title="PO Name">
                  {pData.poname}
                </div>
                <div className={`${styles.cell}`} data-title="Project Name">
                  {pData.projectName}
                </div>
                <div className={`${styles.cell}`} data-title="Total Amount">
                  {pData.currency}{' '}
                  {Number(pData.totalAmount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`${styles.cell}`}
                  data-title="Total Raised Amount"
                >
                  {pData.currency}{' '}
                  {pData.totalRaisedAmount === 'NaN'
                    ? '0.00'
                    : Number(pData.totalRaisedAmount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}

      {slice.length ? (
        <div className={styles.tableFooter}>
          {range.map((el: number, i: number) => (
            <button
              key={i}
              className={`${styles.footerBTN} ${
                page === el ? styles.activeFooterBTN : styles.inactiveFooterBTN
              }`}
              onClick={() => setPage(el)}
            >
              {el}
            </button>
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default TotalDMR;
