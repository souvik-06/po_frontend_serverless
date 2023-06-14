import {
  faDownload,
  faFileExcel,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import XLSX, { read, utils } from 'xlsx';
import config from '../../../config.json';
import { IFileUploader } from '../../../interface';
import styles from '../../DMR/DMR.module.css';

const FileUploader = ({
  fileError,
  setData,
  setWorkbook,
  setFileError,
  inputFileRef,
  handleRemoveFile,
  setSheetName,
  sheetName,
  setHeader,
  projectNames,
  setNewEVCreate,
}: IFileUploader) => {
  const [evData, setEvData] = useState([]);
  const [pName, setpName] = useState('');

  const showOptions = async (e: any) => {
    let data: string = projectNames[e];
    //console.log(data);
    setpName(data);
    await axios
      .get(`${config.SERVER_URL}xlData/${data}`)
      .then(async (response) => {
        const url = response.data;
        await axios
          .get(url, { responseType: 'arraybuffer' })
          .then((response) => {
            const arrayBuffer = response.data;
            console.log(arrayBuffer);

            // Process the arrayBuffer here
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
              type: 'array',
              cellFormula: true,
            });
            const worksheet = workbook.Sheets['JP-EV'];
            const jsonData: any = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            });

            // Calculate Consumption values
            const consumptionColumnIndex = jsonData[0].indexOf('Consumption');
            for (let i = 1; i < jsonData.length; i++) {
              const hours = jsonData[i][2]; // Assuming the Hours column is at index 2
              const rate = jsonData[i][3]; // Assuming the Rate (JPY) column is at index 3

              const consumption =
                parseFloat(hours) * parseFloat(rate.replace('JPY ', ''));
              jsonData[i][consumptionColumnIndex] = `JPY ${consumption.toFixed(
                2
              )}`;
            }

            setEvData(jsonData);
          })
          .catch((error) => {
            console.error(error);
          });
        // console.log(response.data);
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `${data}.xlsx`);
        // document.body.appendChild(link);
        // link.click();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const downloadExcel = (e: any) => {
    const id = toast.loading('Preparing to download.', {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,

      theme: 'light',
      type: 'info',
    });
    let data: string = projectNames[e];
    // axios
    //   .get(`${config.SERVER_URL}xlData/${data}`)
    //   .then((d) => {
    //     console.log(d);
    //     const workbook = d.data;
    //     writeFile(workbook, `${data}.xlsx`);
    //     toast.update(id, {
    //       render: 'File Downloaded.',
    //       type: 'success',
    //       isLoading: false,
    //       autoClose: 300,
    //     });
    //   })
    axios
      .get(`${config.SERVER_URL}xlData/${data}`)
      .then((response) => {
        const url = response.data;
        console.log(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${data}.xlsx`);
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          toast.dismiss(id); // Dismiss the toast after the specified duration
        }, 2000);
      })
      .catch((error: any) => {
        toast.update(id, {
          render: `${error.message}.`,
          type: 'error',
          isLoading: false,
          autoClose: 800,
        });
      });
  };

  const handleFileUpload = (e: any) => {
    e.preventDefault();
    setFileError('');
    try {
      let file: File | null = e.target.files[0];

      if (!file) {
        return;
      }
      console.log(file.type);
      if (
        file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        toast.error('Please select XLSX file only!');
        handleRemoveFile();
      } else {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const workbook = read(event.target.result, {
            type: 'binary',
            cellFormula: true,
          });
          setWorkbook(workbook);
          setSheetName(workbook.SheetNames);
          const selectedWorksheet = workbook.Sheets[workbook.SheetNames[0]];
          const sheetData1: Array<string[]> = utils.sheet_to_json(
            selectedWorksheet,
            {
              header: 1,
              raw: false,
              dateNF: 'yyyy-mm-dd',
              // cellDates: true,
            }
          );
          const sheetData = utils.sheet_to_json(selectedWorksheet, {
            raw: false,
            dateNF: 'yyyy-mm-dd',
            // cellDates: true,
          });
          setHeader(sheetData1[0]);

          // Modify sheet data
          const modifiedSheetData = sheetData.map((row, index) => {
            if (index === 1) {
              return Array.isArray(row)
                ? row.map((cell) => (cell == null || cell === '' ? 0 : cell))
                : row;
            }
            return row;
          });
          setData(modifiedSheetData as string[]);

          console.log(modifiedSheetData, 'sheetdata');
        };
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      setFileError('Error reading file. Please select a valid Excel file.');
    }
  };

  useEffect(() => {}, [evData]);

  return (
    <>
      <div className="d-flex">
        <DropdownButton
          className="my-3"
          variant="outline-dark"
          title={
            <i>
              Download Project data
              <FontAwesomeIcon
                icon={faDownload}
                className="mx-2"
                style={{ color: '#000000' }}
              />
            </i>
          }
          onSelect={downloadExcel}
        >
          {projectNames.map((projectSelect: string, index: number) => (
            <Dropdown.Item key={index} eventKey={index}>
              {projectSelect}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <span className="mx-3" />
        <DropdownButton
          className="my-3"
          variant="outline-dark"
          title={
            <i>
              Show Project EV data
              <FontAwesomeIcon
                icon={faFileExcel}
                className="mx-2"
                style={{ color: '#000000' }}
              />
            </i>
          }
          onSelect={showOptions}
        >
          {projectNames.map((projectSelect: string, index: number) => (
            <Dropdown.Item key={index} eventKey={index}>
              {projectSelect}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <span className="mx-3" />
        <Button
          variant="outline-primary"
          className="my-3"
          onClick={() => setNewEVCreate(true)}
        >
          Add New Project
        </Button>
      </div>
      <Form>
        <Card className="text-center files">
          <Card.Header>Upload Excel file</Card.Header>
          <Card.Body>
            <Card.Text>
              <input
                placeholder="Select File.."
                title="file"
                type="file"
                name="file"
                onChange={handleFileUpload}
                ref={inputFileRef}
                accept=".xlsx"
                required
              />
              {sheetName?.length > 0 ? (
                <i className="fa fa-close" onClick={handleRemoveFile}>
                  {' '}
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ color: '#000000' }}
                  />
                </i>
              ) : null}
            </Card.Text>
            {fileError ? <Alert variant="danger">{fileError}</Alert> : null}
          </Card.Body>
        </Card>
      </Form>

      <br></br>
      <br></br>

      {evData && evData.length > 1 && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ textAlign: 'center' }}>
              <strong>Ev Table of {pName}</strong>
            </span>
          </div>

          <div className={styles.table}>
            <div className={`${styles.rowo} ${styles.header}`}>
              <div className={`${styles.cell}`}>Year</div>
              <div className={`${styles.cell}`}>Type</div>
              <div className={`${styles.cell}`}>Hours</div>
              <div className={`${styles.cell}`}>Rate (JPY)</div>
              <div className={`${styles.cell}`}>Consumption</div>
            </div>

            {evData.slice(1).map((row: any, index) => (
              <div className={styles.rowo} key={index}>
                <div className={`${styles.cell}`} data-title="Year">
                  {row[0]}
                </div>
                <div className={`${styles.cell}`} data-title="Type">
                  {row[1]}
                </div>
                <div className={`${styles.cell}`} data-title="Hours">
                  {row[2]}
                </div>
                <div className={`${styles.cell}`} data-title="Rate (JPY)">
                  {row[3]}
                </div>
                <div className={`${styles.cell}`} data-title="Consumption">
                  {row[4].slice(0, 4)}
                  {Number(row[4].slice(4).trim()).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))}
          </div>
          <br></br>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="outline-dark"
              className="text"
              onClick={() => {
                setEvData([]);
                setpName('');
              }}
            >
              Close EV Table
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default FileUploader;
