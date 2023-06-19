import axios, { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { WorkBook } from 'xlsx';
import DataTable from '../components/EVC/dataTable/DataTable';
import FileUploader from '../components/EVC/fileUploader/FileUploader';
import SheetSelector from '../components/EVC/sheetSelector/SheetSelector';
import NewEV from '../components/EVC/uploadNewEV/NewEV';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { NextPageWithLayout } from './page';

interface errorProps {
  error: boolean | null;
  errMessage?: string | null;
}

const EVC: NextPageWithLayout = () => {
  const [data, setData] = useState<string[]>([]);
  const inputFileRef = useRef<any>();
  const [newEV, setNewEV] = useState<boolean>(false);
  const [showComponent, setShowComponent] = useState<boolean>(false);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState<WorkBook>({} as WorkBook);
  const [header, setHeader] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string>('');
  const [dataError, setDataError] = useState<string>('');
  const [sheetName, setSheetName] = useState<string[]>([]);
  const [error, setError] = useState<errorProps>({
    error: false,
    errMessage: '',
  });
  const [projectName, setProjectName] = useState<string[]>([]);

  const [project, setproject] = useState<string>('');

  // eslint-disable-next-line no-unused-vars
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    document.title = 'EVC';

    let isSubscribe: boolean = true;

    const fetchProjects = async () => {
      try {
        const fetchData = async () => {
          const response = await axios.get(`${config.SERVER_URL}getEvFiles`);
          const currentProjectName = response.data;
          if (currentProjectName !== previousProjectName) {
            // Updated data is available, set the state and exit the function
            setProjectName(currentProjectName);
            console.log(response);
            return;
          }
          // Wait for a specified duration (e.g., 2 seconds) before fetching again
          setTimeout(fetchData, 2000);
        };

        let response = await axios.get(`${config.SERVER_URL}getEvFiles`);
        const initialProjectName = response.data;

        // Keep track of the previous response data
        let previousProjectName = initialProjectName;
        if (projectName.length !== 0) {
          setNewEV(false);
        }

        // Initial call to fetchData
        await fetchData(); // Add 'await' here
      } catch (err) {
        console.log(err);
        setNewEV(true);
        const er: string = ((err as AxiosError).response?.data as any)?.message;
        setError((prev) => ({ ...prev, error: true, errMessage: er }));
      }
    };

    if (isSubscribe) {
      fetchProjects();
    }
    return () => {
      isSubscribe = false;
    };
  }, [projectName.length]);

  const fetchEVF = async () => {
    try {
      const fetchData = async () => {
        const response = await axios.get(`${config.SERVER_URL}getEvFiles`);
        const currentProjectName = response.data;
        //console.log(currentProjectName);
        if (currentProjectName !== previousProjectName) {
          // Updated data is available, set the state and exit the function
          setProjectName(currentProjectName);
          console.log(response);
          return;
        }
        // Wait for a specified duration (e.g., 2 seconds) before fetching again
        setTimeout(fetchData, 2000);
      };

      let response = await axios.get(`${config.SERVER_URL}getEvFiles`);
      const initialProjectName = response.data;
      console.log(initialProjectName);

      // Keep track of the previous response data
      let previousProjectName = initialProjectName;
      if (projectName.length !== 0) {
        setNewEV(false);
      }

      // Initial call to fetchData
      await fetchData(); // Add 'await' here
    } catch (err) {
      console.log(err);
      setNewEV(true);
      const er: string = ((err as AxiosError).response?.data as any)?.message;
      setError((prev) => ({ ...prev, error: true, errMessage: er }));
    }
  };

  const handleSubmit = async () => {
    const id = toast.loading('Submiting...', {
      position: 'bottom-right',
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    if (sheetName.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post(`${config.SERVER_URL}xlData`, {
        data,
        project,
      });

      if (response.status === 404) {
        toast.update(id, {
          render: '404, File Not Found.',
          type: 'error',
          isLoading: false,
          autoClose: 300,
        });
      } else if (response.status === 200) {
        // toast.success('Data Submitted Successfully');
        toast.update(id, {
          render: 'Data Submitted Successfully.',
          type: 'success',
          isLoading: false,
          autoClose: 300,
        });
      }
    } catch (error: any) {
      toast.update(id, {
        render: `${error.message}.`,
        type: 'error',
        isLoading: false,
        autoClose: 300,
      });
    }
  };
  const handleSelectChange = (e: any) => {
    let event: string = projectName[e];
    //
    setproject(event);

    console.log(event);
  };
  const handleRemoveFile = () => {
    setData([]);
    setWorkbook({} as WorkBook);
    setFileError('');
    setSheetName([]);
    setproject('');
    setShowComponent(false);
    inputFileRef.current.value = '';
    // toast.info(`${error.message}`);
  };

  return (
    <Container className=" mb-5">
      {projectName.length && !newEV ? (
        <>
          <Row className="mt-3">
            <Col>
              <FileUploader
                setNewEVCreate={setNewEV}
                data={data}
                projectNames={projectName}
                fileError={fileError}
                setData={setData}
                setWorkbook={setWorkbook}
                setFileError={setFileError}
                inputFileRef={inputFileRef}
                handleRemoveFile={handleRemoveFile}
                setSheetName={setSheetName}
                sheetName={sheetName}
                setHeader={setHeader}
                fetchEVF={fetchEVF}
                showTable={setShowComponent}
              />
            </Col>
          </Row>
          {sheetName?.length > 0 && (
            <Row className="mt-3">
              <Col>
                <SheetSelector
                  workbook={workbook}
                  selectedSheetIndex={selectedSheetIndex}
                  setSelectedSheetIndex={setSelectedSheetIndex}
                  setData={setData}
                  data={data}
                  setHeader={setHeader}
                />
                {validationError && (
                  <Alert variant="danger">{validationError}</Alert>
                )}

                <div className="d-flex my-2 flex-row justify-content-between align-items-center align-content-between flex-wrap">
                  <div>
                    <Button
                      className="my-3"
                      variant="outline-dark"
                      onClick={() => {
                        setShowComponent(!showComponent);
                      }}
                    >
                      {showComponent ? 'Hide' : 'Show'} Table
                    </Button>
                    <span className="mx-2"></span>
                    <Button
                      className="my-3"
                      variant="outline-danger"
                      onClick={handleRemoveFile}
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="d-flex">
                    <DropdownButton
                      className="my-3 border rounded"
                      variant="outline"
                      title="Select Project"
                      onSelect={handleSelectChange}
                    >
                      {projectName.map(
                        (projectSelect: string, index: number) => (
                          <Dropdown.Item key={index} eventKey={index}>
                            {projectSelect}
                          </Dropdown.Item>
                        )
                      )}
                    </DropdownButton>

                    <span className="mx-2"></span>
                    {project.length <= 0 ? (
                      <OverlayTrigger
                        key="top"
                        placement="top"
                        overlay={
                          <Popover id="popover-basic">
                            <Popover.Body className="danger">
                              Please select <strong>Project Name.</strong>{' '}
                              Before Submitting data.
                            </Popover.Body>
                          </Popover>
                        }
                      >
                        <Button
                          className="my-3 border rounded"
                          variant="outline"
                        >
                          {`Submit`}
                        </Button>
                      </OverlayTrigger>
                    ) : (
                      <Button
                        className="my-3"
                        variant="outline-primary"
                        onClick={handleSubmit}
                      >
                        {`Submitting in ${project}`}
                      </Button>
                    )}
                  </div>
                </div>
                {showComponent && <DataTable data={data} headers={header} />}

                {dataError && <Alert variant="warning">{dataError}</Alert>}
              </Col>
            </Row>
          )}
        </>
      ) : (
        <>
          {newEV && (
            <NewEV
              errorMessage={error.errMessage}
              projectNames={projectName}
              newEV={newEV}
              setNewEVCreate={setNewEV}
              fetchEVF={fetchEVF}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default EVC;
EVC.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
