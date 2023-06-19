import axios from 'axios';
import { memo, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../../../config.json';
import { sortedData } from '../../../interface';
import '../DMR.module.css';

const DMRinputs = ({ details }: { details: sortedData }) => {
  const data = details.details;
  //console.log(data);
  const [inputList, setInputList] = useState(data);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    console.log('DMRINput', data);
    e.preventDefault();

    let isValid = true;

    data.map((a) => {
      console.log(a);
      if (a.raisedAmount?.length === 0) {
        toast.error('Please fill Raised Amount.');
        isValid = false;
      } else if (a.dmrNo?.length === 0) {
        toast.error('Please fill DMR No.');
        isValid = false;
      } else if (a.date?.length === 0) {
        toast.error('Please fill Date.');
        isValid = false;
      } else if (parseFloat(a.raisedAmount) > parseFloat(a.amount)) {
        toast.error('Raised Amount Cannot be more than the Amount');
        isValid = false;
      }
    });

    if (isValid) {
      axios
        .patch(`${config.SERVER_URL}poDetails/${details.ponumber}`, data)
        .then((res) => {
          if (res.status === 404) {
            toast.error('404, File Not Found.');
          } else if (res.status === 200) {
            toast.success('Data updated successfully.');
          }
        })
        .catch((err) => {
          toast.error(`Data Not Updated. Error: ${err.message}.`);
          // console.log(err);
        });
    }
  };

  //console.log('filepath', details.filePath);

  return (
    <div>
      <Row>
        <Col className="form__group field">
          <input
            className="text-input form__field"
            type="number"
            name="ponumber"
            id="ponumber"
            value={details.ponumber}
            disabled
          />
          <label htmlFor="ponumber" className="form__label">
            PO Number
          </label>
        </Col>
        <Col className="form__group field">
          <input
            className="text-input form__field"
            type="text"
            name="poname"
            id="poname"
            value={details.poname}
            disabled
          />
          <label htmlFor="ponumber" className="form__label">
            PO Name
          </label>
        </Col>
        <Col className="form__group field">
          <input
            className="text-input form__field"
            type="text"
            name="projectName"
            id="projectName"
            value={details.projectName}
            disabled
          />
          <label htmlFor="ponumber" className="form__label">
            Project Name
          </label>
        </Col>
      </Row>
      <Row className="mt-3 mb-3">
        <Col className="form__group field ">
          <input
            className="text-input form__field"
            type="date"
            name="date"
            id="date"
            value={details.date}
            disabled
          />
          <label htmlFor="ponumber" className="form__label">
            Date
          </label>
        </Col>
        <Col className="form__group field File">
          <input
            className="text-input form__field"
            type="text"
            name="file"
            id="file"
            value={details.filename}
            disabled
          />
          <label htmlFor="ponumber" className="form__label">
            File Name
          </label>
          <a href={`${details.filePath}`} target="_blank" rel="noreferrer">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="m8 12 4 4 4-4"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                ></path>
              </g>
            </svg>
          </a>
        </Col>
      </Row>

      <span className="input-group-btn" style={{ width: '10px' }}></span>

      <Table striped bordered hover responsive="sm" variant="light">
        <thead>
          <tr>
            <th>Product</th>
            <th>Amount</th>
            <th>
              Raised Amount
              <span className="star">*</span>
            </th>
            <th>
              DMR No.
              <span className="star">*</span>
            </th>
            <th>
              Date
              <span className="star">*</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((elementInArray, index) => {
            return (
              <tr key={index}>
                <th scope="row">
                  <Form.Control
                    name="description"
                    id="description"
                    value={elementInArray.po_description}
                    disabled
                  />
                </th>
                <td>
                  <Form.Control
                    name="amount"
                    id="amount"
                    value={elementInArray.amount}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    name="raisedAmount"
                    id="raisedAmount"
                    value={elementInArray.raisedAmount}
                    onChange={(e) => {
                      const input = e.target.value;
                      let decimalValue = input.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-dot characters

                      const dotIndex = decimalValue.indexOf('.');
                      if (dotIndex !== -1) {
                        // Limit the input to two decimal places after the dot
                        const decimalPart = decimalValue.slice(dotIndex + 1);
                        decimalValue =
                          decimalValue.slice(0, dotIndex + 1) +
                          decimalPart.slice(0, 2);
                      }

                      if (/^\d*\.?\d{0,2}$/.test(decimalValue)) {
                        // Only update the value if it's empty or contains up to two decimal places
                        elementInArray.raisedAmount = decimalValue;
                      } else {
                        // Handle invalid input (clear the value or take other action)
                        elementInArray.raisedAmount = ''; // or any other desired action
                      }

                      setInputList({ ...inputList });
                    }}
                  />
                </td>
                <td>
                  <Form.Control
                    name="dmrNo"
                    id="dmrNo"
                    value={elementInArray.dmrNo}
                    onChange={(e) => {
                      elementInArray.dmrNo = e.target.value;
                      setInputList({ ...inputList! });
                    }}
                  />
                </td>
                <td>
                  <Form.Control
                    name="date"
                    id="date"
                    type="date"
                    value={elementInArray.date}
                    onChange={(e) => {
                      elementInArray.date = e.target.value;
                      setInputList({ ...inputList! });
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between mt-3">
        <Button
          type="submit"
          variant="outline-dark"
          className="mx-auto col-md-6 submitBtn"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(DMRinputs);
