import axios from 'axios';
import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { SpinnerCircular } from 'spinners-react';
import config from '../../../config.json';
import style from '../PO.module.css';
import AddRows from '../RowAR/RowAR';

interface IInputList {
  po_id: string;
  po_type: string;
  poname: string;
  projectName: string;
  date: string;
  currency: string;
  items: {
    index: number;
    po_description: string;
    amount: string;
    raisedAmount: string;
    dmrNo: string;
    date: string;
  }[];
  filename: string;
}

type props = {
  file: File;
  handleReset: () => void;
  fileName: string;
};
const PoDetails = ({ file, handleReset, fileName }: props) => {
  //initial structre of input details
  const [inputList, setInputList] = useState<IInputList>({
    po_id: '',
    po_type: '',
    poname: '',
    projectName: '',
    date: '',
    currency: '',
    items: [
      {
        index: Math.random(),
        po_description: '',
        amount: '',
        dmrNo: '',
        raisedAmount: '',
        date: '',
      },
    ],
    filename: fileName.replace(/\s+/g, '+'),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Adding consecutive rows in particular DMR
  const handleAddRows = () => {
    setInputList({
      ...inputList,
      items: [
        ...inputList.items,
        {
          index: Math.random(),
          po_description: '',
          amount: '',
          dmrNo: '',
          raisedAmount: '',
          date: '',
        },
      ],
    });
  };

  //Adding consecutive rows in particular DMR
  const handleRemoveRows = (index: number) => {
    setInputList({
      ...inputList,
      items: inputList.items.filter((s, sindex) => index !== sindex),
    });
  };

  //Submit
  const formSubmit = async (e: any) => {
    e.preventDefault();
    //TO DO
    if (inputList.po_id.length === 0) {
      toast.error('Please fill PO Number.');
    } else if (inputList.date.length === 0) {
      toast.error('Please fill date.');
    } else if (inputList.poname.length === 0) {
      toast.error('Please fill PO Name.');
    } else if (inputList.projectName.length === 0) {
      toast.error('Please fill Project Name.');
    } else if (inputList.items.every((a) => a.amount.length === 0)) {
      toast.error('Please fill Amount.');
    } else if (inputList.items.every((a) => a.po_description.length === 0)) {
      toast.error('Please fill Product Name.');
    } else if (inputList.po_type.length === 0) {
      toast.error('Please fill Project Type.');
    } else if (inputList.currency.length === 0) {
      toast.error('Please Select Currency.');
    } else {
      setIsLoading(true);
      const { po_id, po_type, date, poname, projectName, currency, items } =
        inputList;
      const formData = new FormData();
      formData.append('file', file);
      console.log(file);
      const data = {
        po_id,
        po_type,
        date,
        poname,
        projectName,
        currency,
        items,
        filename: file.name,
      };
      formData.append('details', JSON.stringify(data));
      try {
        const response = await axios.post(
          `${config.SERVER_URL}poDetails`,
          formData
        );
        if (response.status === 200) {
          handleReset();
          setIsLoading(false);
          console.log(response, 'POdetails');
          toast.success(`${response.data.msg} `);
          // await axios.post(`${config.SERVER_URL}uploadFile`, formData);
        }
        if (response.status === 404) {
          handleReset();
          setIsLoading(false);
          toast.success(`${response.data.msg} `);
          // await axios.post(`${config.SERVER_URL}uploadFile`, formData);
        }
        if (response.status !== 404 && response.status !== 200) {
          // handleReset();
          setIsLoading(false);
          toast.success(`${response.data.msg} `);
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(`${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-center mt-5">Please fill Purchase Order details</h3>
      <br />
      <Form>
        <Form.Group>
          <br />
          <Row>
            <Col className={`${style.formGroup} ${style.field}`}>
              <input
                className={`${style['formField']} text-input`}
                type="number"
                placeholder="Enter order number"
                name="ponumber"
                id="ponumber"
                value={inputList.po_id}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, po_id: e.target.value })
                }
              />
              <label htmlFor="ponumber" className="form__label">
                PO Number <span className="star">*</span>
              </label>
            </Col>
            <Col className={`${style.formGroup} ${style.field}`}>
              <select
                className={`${style['formField']} text-input`}
                name="potype"
                id="potype"
                value={inputList.po_type}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, po_type: e.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="Fixed">Fixed</option>
                <option value="T&M">T&M</option>

                {/* Add more options as needed */}
              </select>
              <label htmlFor="poType" className="form__label">
                PO Type <span className="star">*</span>
              </label>
            </Col>

            <Col className={`${style.formGroup} ${style.field}`}>
              <input
                className={`${style['formField']} text-input`}
                type="text"
                placeholder="Enter PO Name"
                name="poname"
                id="poname"
                value={inputList.poname}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, poname: e.target.value })
                }
              />
              <label htmlFor="poname" className="form__label">
                PO Name <span className="star">*</span>
              </label>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col className={`${style.formGroup} ${style.field}`}>
              <input
                className={`${style['formField']} text-input`}
                type="text"
                placeholder="Enter order number"
                name="projectName"
                id="projectName"
                value={inputList.projectName}
                required
                aria-required
                onChange={(e) =>
                  setInputList({ ...inputList, projectName: e.target.value })
                }
              />
              <label htmlFor="ponumber" className="form__label">
                Project Name <span className="star">*</span>
              </label>
            </Col>
            <Col className={`${style.formGroup} ${style.field}`}>
              <input
                className={`${style['formField']} text-input`}
                type="date"
                placeholder="Select Date"
                name="date"
                id="date"
                aria-required
                required
                value={inputList.date}
                onChange={(e) =>
                  setInputList({ ...inputList, date: e.target.value })
                }
              />
              <label htmlFor="date" className="form__label">
                Select date <span className="star">*</span>
              </label>
            </Col>
            <Col className={`${style.formGroup} ${style.field}`}>
              <select
                className={`${style['formField']} currency-dropdown`}
                name="currency"
                id="currency"
                aria-required
                required
                value={inputList.currency}
                onChange={(e) =>
                  setInputList({ ...inputList, currency: e.target.value })
                }
              >
                <option value="" disabled selected>
                  Select Currency
                </option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
                <option value="INR">INR</option>
              </select>
              <label htmlFor="currency" className="form__label">
                Select currency <span className="star">*</span>
              </label>
            </Col>
          </Row>
          <br />
        </Form.Group>
        <AddRows
          deleted={handleRemoveRows}
          inputList={inputList}
          setInputList={setInputList}
        />
        <Form.Group className="d-flex justify-content-between" as={Col}>
          {!isLoading ? (
            <div className=" ">
              <button
                className="mt-3 btn btn-outline-primary"
                onClick={formSubmit}
              >
                Submit
              </button>
              <span style={{ margin: '3px' }} />
              <button
                className="btn btn-outline-danger mt-3"
                type="reset"
                onClick={() => handleReset()}
              >
                Cancel
              </button>{' '}
            </div>
          ) : (
            <SpinnerCircular
              className="m-2 px-2"
              size={45}
              thickness={100}
              speed={100}
              color="#000"
              secondaryColor="rgba(0, 0, 0, 0.44)"
            />
          )}

          <button
            title="addRows"
            onClick={handleAddRows}
            type="button"
            className="btn btn-outline-primary mt-3 "
            style={{ maxHeight: '40px' }}
          >
            +
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PoDetails;
