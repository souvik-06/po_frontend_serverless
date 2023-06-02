import { useEffect } from 'react';
import { Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { utils } from 'xlsx';
import { ISheetSelector } from '../../../interface';

const SheetSelector = ({
  workbook,
  selectedSheetIndex,
  setSelectedSheetIndex,
  setData,
  data,
  setHeader,
}: ISheetSelector) => {
  useEffect(() => {
    setSelectedSheetIndex(0);
  }, [setSelectedSheetIndex]);

  useEffect(() => {
    const readData = () => {
      const sheetdata = data;
      setData(sheetdata);
    };
    readData();
  }, [data, setData]);

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
    console.log(sheetData1, 'sheetdata header');
    setData(sheetData);
    setHeader(sheetData1[0]);
    console.log(sheetData1[0], 'Headersssss');
  };

  return (
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
            {workbook.SheetNames.map((sheetName: string, index: number) => (
              <Dropdown.Item key={index} eventKey={index}>
                {sheetName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SheetSelector;
