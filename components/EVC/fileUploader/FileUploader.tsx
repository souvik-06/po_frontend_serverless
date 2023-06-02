import { faDownload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
  Alert,
  Button,
  Card,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { read, utils } from 'xlsx';
import config from '../../../config.json';
import { IFileUploader } from '../../../interface';

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
  const downloadExcel = (e: any) => {
    const id = toast.loading('Preparing to download.', {
      position: 'bottom-right',
      autoClose: 500,
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
    </>
  );
};

export default FileUploader;
