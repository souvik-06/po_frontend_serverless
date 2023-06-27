/* eslint-disable no-unused-vars */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { toast } from 'react-toastify';
import XLSX, { WorkBook, read, utils } from 'xlsx';
import config from '../../../config.json';
import DataTable from '../dataTable/DataTable';

type Props = {
  errorMessage: string | null | undefined;
  projectNames: string[];
  newEV: boolean;
  setNewEVCreate: Dispatch<SetStateAction<boolean>>;
  fetchEVF: () => void;
};

const NewEV = ({
  errorMessage,
  projectNames,
  setNewEVCreate,
  fetchEVF,
}: Props) => {
  // const [create, setCreate] = useState<boolean>(false);
  const [project, setproject] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const inputFileRef = useRef<any>(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [workbook, setWorkbook] = useState<WorkBook>({} as WorkBook);
  const [header, setHeader] = useState<string[]>([]);
  const [data, setData] = useState<string[]>([]);
  const [sheetName, setSheetName] = useState<string[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [showComponent, setShowComponent] = useState<boolean>(false);

  const handleReset = () => {
    inputFileRef.current.value = null;
    setFileName('');
    setFile(null);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const selectedFiles = files as FileList;
    const file: File = selectedFiles?.[0];
    console.log(file);

    if (!file) {
      return;
    }
    console.log(file.type);
    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      toast.error('Please select XLSX file only!');
      handleReset();
    } else {
      setFile(file);
      setFileName(file.name);
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
      if (file instanceof File) {
        reader.readAsBinaryString(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.warning('please select file first');
    }
    if (project.length === 0) {
      toast.warning('Please Select Project Name');
    } else if (project.length > 0) {
      if (file) {
        try {
          const resource = data.every((a) => {
            const propertyName = 'resource';
            return Object.keys(a).some(
              (key) => key.toLowerCase() === propertyName
            );
          });

          const offshore = data.every((a) => {
            const propertyName = 'offshore';
            const propertyName1 = 'ofshore';
            return Object.keys(a).some(
              (key) =>
                key.toLowerCase() === propertyName ||
                key.toLowerCase() === propertyName1
            );
          });

          //console.log(bool);
          if (resource === true && offshore === true) {
            const isNumeric = (value: string) => /^-?\d+\.?\d*$/.test(value);

            const areAllNumeric = (data: string | any[]) => {
              const checkValue = (value: any) => isNumeric(value);

              for (let i = 0; i < data.length; i++) {
                const object = data[i];
                for (const key in object) {
                  if (
                    key !== 'Resource' &&
                    key !== 'Ofshore' &&
                    !checkValue(object[key])
                  ) {
                    return false;
                  }
                }
              }
              return true;
            };

            const allNumeric = areAllNumeric(data);

            if (allNumeric === true) {
              const newWorkbook = XLSX.utils.book_new();

              // Add a sheet with the extracted data to the new workbook
              const newSheet = XLSX.utils.json_to_sheet(data);
              XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'JP-M');

              // Generate the XLSX file as binary data
              const binaryString = XLSX.write(newWorkbook, {
                bookType: 'xlsx',
                type: 'binary',
              });
              const buffer = Buffer.from(binaryString, 'binary');

              // Create a new FormData object
              const formXlData = new FormData();

              // Append the XLSX file data as a Blob or File object
              const xlfile = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });

              formXlData.append('file', xlfile);
              formXlData.append('project', project);

              const response = await axios.post(
                `${config.SERVER_URL}evDataCreate`,
                formXlData
              );

              if (response.status === 404) {
                toast.error('File Not Uploaded');
              } else if (response.status === 200) {
                // toast.success('Data Submitted Successfully');
                fetchEVF();
                toast.success('File Saved Successfully');
              }
            } else {
              toast.error('Error reading file, have Non-Numeric Values');
            }
          } else if (resource === false && offshore === true) {
            toast.error('Sheet does not have resource');
          } else if (resource === true && offshore === false) {
            toast.error('Sheet does not have offshore');
          } else {
            toast.error('Sheet does not have resource and offshore');
          }
        } catch (error: any) {
          toast.error(`${error.message}.`);
        }
      }
    }
  };

  const handleSelectChange = (e: any) => {
    setSelectedSheetIndex(e);
    const worksheetNames = workbook.SheetNames;
    const selectedWorksheet = workbook.Sheets[worksheetNames[e]];
    const sheetData: Array<string> = utils.sheet_to_json(selectedWorksheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd',
      // cellDates: true,
    });
    const sheetData1: Array<string[]> = utils.sheet_to_json(selectedWorksheet, {
      header: 1,
      raw: false,
      dateNF: 'yyyy-mm-dd',
      // cellDates: true,
    });
    console.log(sheetData, 'ggggggggggggg sheetdata');
    setData(sheetData);
    setHeader(sheetData1[0]);
    console.log(sheetData1[0], 'Headersssss sheetData1');
  };

  useEffect(() => {
    if (projectNames.length === 0) {
      setTimeout(() => {
        fetchEVF();
      }, 2000); // 2000 milliseconds (2 seconds) delay
    }
  }, [fetchEVF, projectNames.length]);

  return (
    <div className="my-4">
      <div>
        {projectNames.length === 0 && (
          <h4 className="my-4">
            <small> Can&apos;t find any project.</small>
            <br />
            <strong>Please add new project !</strong>
          </h4>
        )}
        <Card className=" mt-3 files">
          {file == null && (
            <Card.Header className="text-center">
              Please select EV Calculation file.
            </Card.Header>
          )}
          {file != null && (
            <Card.Header className="text-center">
              {fileName} uploaded successfully.
            </Card.Header>
          )}

          <Card.Body>
            <Card.Text className="mx-4">
              <input
                title="file"
                type="file"
                name="file"
                onChange={handleOnChange}
                ref={inputFileRef}
                accept=".xlsx"
                required
              />
              {file != null ? (
                <i onClick={handleReset}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ color: '#000000' }}
                  />
                </i>
              ) : null}
            </Card.Text>
            <div>
              <div className="text-center m-4 files toolbar">
                <div className="search">
                  <input
                    type="text"
                    className="input_projectName"
                    placeholder="Enter Project Name"
                    onChange={(e) => setproject(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2 w-100 justify-content-end">
                  <button
                    style={{
                      width: '7rem',
                    }}
                    className={`btn btn-outline-primary`}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    style={{
                      width: '7rem',
                    }}
                    className={`btn btn-outline-danger `}
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  {projectNames.length > 0 && (
                    <button
                      style={{
                        width: '7rem',
                      }}
                      onClick={() => setNewEVCreate(false)}
                      className={`btn btn-outline-dark `}
                    >
                      Go Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {sheetName.length > 0 && (
          <>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between mt-1">
                  <h5 className="mt-1 fw-bolder">
                    Selected Sheet: {workbook.SheetNames[selectedSheetIndex]}
                  </h5>
                  <DropdownButton
                    className="mb-1"
                    variant="outline-dark"
                    title="Select sheet"
                    onSelect={handleSelectChange}
                  >
                    {workbook.SheetNames.map(
                      (sheetName: string, index: number) => (
                        <Dropdown.Item key={index} eventKey={index}>
                          {sheetName}
                        </Dropdown.Item>
                      )
                    )}
                  </DropdownButton>
                </div>
              </Card.Body>
            </Card>
            <div className="d-flex">
              <Button
                className="my-3"
                variant="outline-dark"
                onClick={() => {
                  setShowComponent(!showComponent);
                }}
              >
                {showComponent ? 'Hide' : 'Show'} Table
              </Button>
            </div>
          </>
        )}
        {showComponent && <DataTable data={data} headers={header} />}
      </div>
    </div>
  );
};
export default NewEV;
