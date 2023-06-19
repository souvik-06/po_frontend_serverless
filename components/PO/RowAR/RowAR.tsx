import { Col, Row } from 'react-bootstrap';
import '../PO.module.css';

interface IAddRows {
  inputList: any;
  deleted: any;
  setInputList: any;
}

const AddRows = ({ inputList, deleted, setInputList }: IAddRows) => {
  const { items } = inputList;
  return items.map((val: any, idx: any) => {
    const po_description = `po_description-${idx}`;
    const amount = `amount-${idx}`;
    return (
      <Row className="mb-3 " key={val.index}>
        <Col className="form__group field">
          <input
            className="text-input form__field"
            aria-label="Enter Product name"
            name="product"
            data-id={idx}
            required
            value={val.po_description}
            id={po_description}
            onChange={(e) => {
              val.po_description = e.target.value;
              setInputList({ ...inputList });
            }}
          />
          <label htmlFor="dater" className="form__label">
            Product {idx + 1} <span className="star">*</span>
          </label>
        </Col>

        <Col className="form__group field count">
          <>
            <input
              className="text-input form__field"
              type="text"
              aria-label="Enter Amount"
              name="amount"
              data-id={idx}
              required
              id={amount}
              value={val.amount}
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
                  val.amount = decimalValue;
                } else {
                  // Handle invalid input (clear the value or take other action)
                  val.amount = ''; // or any other desired action
                }

                setInputList({ ...inputList });
              }}
            />
            <label htmlFor="dater" className="form__label">
              Amount <span className="star">*</span>
            </label>
            <button
              title="d"
              onClick={() => deleted(idx)}
              type="button"
              className="btn btn-outline-danger"
            >
              -
            </button>
          </>
        </Col>
      </Row>
    );
  });
};

export default AddRows;
