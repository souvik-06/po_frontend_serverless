import axios from 'axios';
import { useState } from 'react';
import config from '../../../config.json';
import { sortedData } from '../../../interface';
import styles from '../DMR.module.css';
import PODesc from './poDesc/PODesc';
import useTable from './useTable/useTable';
interface errorProps {
  error: boolean | null;
  errMessage: string | null;
}

const ListPo = ({ poDetails }: { poDetails: sortedData[] }) => {
  const data = poDetails;
  const [listData, setListData] = useState<sortedData | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<errorProps>({
    error: false,
    errMessage: '',
  });
  const { slice, range } = useTable(data, page, 10);

  const handlePODetails = async (ponumber: string) => {
    axios
      .get(`${config.SERVER_URL}getdetails/${ponumber}`)
      .then((res) => {
        setListData(res?.data);
        //console.log(res?.data);
      })
      .catch(() => {
        setError((prev) => ({ ...prev, error: true }));
      });
  };

  return (
    <div>
      {error.error === true ? (
        <pre>
          <h1>Something went wrong.</h1>
          <p>PO list can&apos;t fetched.</p>
        </pre>
      ) : (
        <>
          {listData ? (
            <div>
              <button
                className={`${styles.butn_one}  mb-3`}
                onClick={() => setListData(null)}
              >
                <span> Go Back</span>
              </button>
              <PODesc searchDetails={listData} />
            </div>
          ) : (
            <>
              <div className={styles.table}>
                <div className={`${styles.rowo} ${styles.header}`}>
                  <div className={`${styles.cell}`}>S.No.</div>
                  <div className={`${styles.cell}`}>PO Number</div>
                  <div className={`${styles.cell}`}>PO Type</div>
                  <div className={`${styles.cell}`}>PO Name</div>
                  <div className={`${styles.cell}`}>Project Name</div>
                  <div className={`${styles.cell}`}>Date</div>
                  <div className={`${styles.cell}`}></div>
                </div>

                {slice?.map((pData: sortedData, index: number) => {
                  //console.log(pData);
                  return (
                    // onClick = {(e) => handlePODetails(`${pData.ponumber}`, e)}
                    <div className={styles.rowo} key={index}>
                      <div className={`${styles.cell}`} data-title="S.No.">
                        {pData.id}
                      </div>
                      <div className={`${styles.cell}`} data-title="PO Number">
                        {pData.ponumber}
                      </div>
                      <div className={`${styles.cell}`} data-title="PO Type">
                        {pData.potype}
                      </div>
                      <div className={`${styles.cell}`} data-title="PO Name">
                        {pData.poname}
                      </div>
                      <div
                        className={`${styles.cell}`}
                        data-title="Project Name"
                      >
                        {pData.projectName}
                      </div>
                      <div className={`${styles.cell}`} data-title="Date">
                        {pData.date}
                      </div>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handlePODetails(`${pData.ponumber}`)}
                      >
                        View more
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className={styles.tableFooter}>
                {range.map((el: number, i: number) => (
                  <button
                    key={i}
                    className={`${styles.footerBTN} ${
                      page === el
                        ? styles.activeFooterBTN
                        : styles.inactiveFooterBTN
                    }`}
                    onClick={() => setPage(el)}
                  >
                    {el}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ListPo;
