import { Table } from 'react-bootstrap';
import { IDataTable } from '../../../interface';

const DataTable = ({ data, headers }: IDataTable) => {
  return (
    <div
      className="table-responsive"
      style={{ maxHeight: '90vh', overflow: 'scroll' }}
    >
      <Table striped bordered hover>
        <thead>
          <tr>
            {headers &&
              headers.map((cell: any, index: any) => (
                <th
                  key={index}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cell}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((numList: any, i: number) => (
            <tr key={i}>
              {headers &&
                headers.map((num: any, j: any) => (
                  <td
                    key={j}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {numList[num]}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
