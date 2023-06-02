import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PoDetails from '../components/PO/PoDetails/PoDetails';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import { NextPageWithLayout } from './page';

const Home: NextPageWithLayout = () => {
  const fileRef = useRef<any>();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const 
  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const selectedFiles = files as FileList;
    const file: File = selectedFiles?.[0];

    if (!file) { return }
    console.log(file.type)
    if (file.type !== 'application/pdf') {
      toast.error('Please select PDF file only!')
      fileRef.current.value = ''
    } else {
      setFileName(file.name);
      setFile(file);
    }

  };
  const handleReset = () => {
    setFileName('');
    setFile(null);
    fileRef.current.value = '';
  };
  return (
    <>
      <Container>
        <Card className="text-center mt-3 files">
          <Card.Header>Upload PO</Card.Header>
          <Card.Body>
            {file == null && (
              <Card.Title>Please select Purchase Order file.</Card.Title>
            )}
            {file != null && (
              <Card.Title>{fileName} uploaded successfully.</Card.Title>
            )}
            <Card.Text>
              <input
                title="file"
                type="file"
                name="file"
                onChange={handleOnChange}
                ref={fileRef}
                accept=".pdf"
                required
              />
              {file != null ? (
                <> <i onClick={handleReset}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={{ color: '#000000' }}
                  />
                </i>

                </>
              ) : null}
            </Card.Text>
          </Card.Body>
        </Card>
        {file != null && (
          <PoDetails
            file={file}
            fileName={fileName}
            handleReset={handleReset}
          />
        )}
      </Container>
    </>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
