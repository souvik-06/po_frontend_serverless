/* eslint-disable no-unused-vars */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../../../config.json';

type Props = {
  errorMessage: string | null | undefined;
  projectNames: string[];
  newEV: boolean;
  setNewEVCreate: Dispatch<SetStateAction<boolean>>;
};

const NewEV = ({ errorMessage, projectNames, setNewEVCreate }: Props) => {
  // const [create, setCreate] = useState<boolean>(false);
  const [project, setproject] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const inputFileRef = useRef<any>(null);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

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
    }
  };

  const handleSubmit = async () => {
    const id = toast.loading('Submiting...', {
      position: 'top-right',
      className: 'm-2 ',
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    if (!file) {
      toast.update(id, {
        render: 'Please select file first.',
        type: 'warning',
        isLoading: false,
        autoClose: 700,
      });
    }
    if (project.length === 0) {
      toast.update(id, {
        render: 'Please enter project name.',
        type: 'warning',
        isLoading: false,
        autoClose: 700,
      });
    } else if (project.length > 0) {

      const formData = new FormData();
      let tempfile = file as File
      formData.append('file', tempfile);
      formData.append('project', project);


      const response = await axios.post(`${config.SERVER_URL}evDataCreate`,
        formData
      );
      console.log(response)
      if (response.status === 404) {
        toast.update(id, {
          render: 'Error.',
          type: 'error',
          isLoading: false,
          autoClose: 300,
        });
      } else if (response.status === 200) {
        // toast.success('Data Submitted Successfully');
        toast.update(id, {
          render: 'File saved Successfully.',
          type: 'success',
          isLoading: false,
          autoClose: 300,
        });
      }
    }
  };

  return (
    <div className="my-4">

      <div>
        {projectNames.length === 0 && <h4 className='my-4'>
          <small> Can&apos;t find any project.</small>
          <br />
          <strong>Please add new project !</strong>
        </h4>}
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
                  >
                    Reset
                  </button>
                  {projectNames.length > 0 && <button
                    style={{
                      width: '7rem',
                    }}
                    onClick={() => setNewEVCreate(false)}
                    className={`btn btn-outline-dark `}
                  >
                    Go Back
                  </button>}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

    </div>
  );
};
export default NewEV;
