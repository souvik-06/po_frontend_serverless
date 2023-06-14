import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import TotalDMR from '../components/TotalDMR/totalAmount';
import PrimaryLayout from '../components/layouts/primary/PrimaryLayout';
import config from '../config.json';
import { sortedData } from '../interface';
import { NextPageWithLayout } from './page';

const Total: NextPageWithLayout = () => {
  const [po, setPo] = useState<sortedData[]>([]);
  const [filterType, setFilterType] = useState<string>('All');
  const [projectType, setProjectType] = useState<string>('All');
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    let isSubscribe: boolean = true;
    const fetchAllPo = async () => {
      try {
        const response = await axios.get(`${config.SERVER_URL}getAllItems`);

        //console.log(response);
        let data: sortedData[] = response.data;
        data = data.map((el) => {
          let totalAmount = 0;
          let totalRaisedAmount = 0;
          el.details.map((ed) => {
            if (!isNaN(Number(ed.amount))) {
              totalAmount += parseFloat(ed.amount);
            }
            if (!isNaN(Number(ed.raisedAmount))) {
              totalRaisedAmount += parseFloat(ed.raisedAmount);
            }
          });
          return {
            ...el,
            totalAmount: totalAmount.toFixed(2),
            totalRaisedAmount: totalRaisedAmount.toFixed(2),
          };
        });

        if (filterType === 'All' && projectType === 'All') {
          setPo(data);
        } else if (filterType === 'All' && projectType === 'Fixed') {
          data = data.filter((elem) => {
            if (elem.potype === 'Fixed') {
              return elem;
            }
          });
          setPo(data);
        } else if (filterType === 'All' && projectType === 'T&M') {
          data = data.filter((elem) => {
            if (elem.potype === 'T&M') {
              return elem;
            }
          });
          setPo(data);
        } else if (projectType === 'Fixed' && filterType !== 'All') {
          data = data.filter((elem) => {
            if (
              elem.date.slice(0, 4) === filterType &&
              elem.potype === 'Fixed'
            ) {
              return elem;
            }
          });
          setPo(data);
        } else if (projectType === 'T&M' && filterType !== 'All') {
          data = data.filter((elem) => {
            if (elem.date.slice(0, 4) === filterType && elem.potype === 'T&M') {
              return elem;
            }
          });
          setPo(data);
        } else if (projectType === 'All' && filterType !== 'All') {
          data = data.filter((elem) => {
            if (elem.date.slice(0, 4) === filterType) {
              return elem;
            }
          });
          setPo(data);
        }
      } catch (err: any) {
        console.log(err);
      }
    };

    //console.log(years);

    if (isSubscribe) {
      fetchAllPo();
    }

    return () => {
      isSubscribe = false;
    };
  }, [filterType, projectType]);

  const yearss = po.map((item) => {
    return item.date.slice(0, 4);
  });

  //console.log(years);

  yearss.sort();

  yearss.filter((a) => {
    if (!years.includes(a)) {
      setYears([...years, a]);
    }
  });

  return (
    <Container>
      <br></br>
      <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Dropdown>
          <Dropdown.Toggle
            className="dropdown-toggle p-3"
            variant="outline-dark"
          >
            Filter By Year : {filterType}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu dropdown-menu-light">
            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                setFilterType('All');
              }}
            >
              All
            </Dropdown.Item>
            {years.map((year, index: number) => {
              return (
                <Dropdown.Item
                  className="dropdown-item"
                  key={index}
                  onClick={() => {
                    setFilterType(year);
                  }}
                >
                  {year}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown style={{ marginLeft: '10px' }}>
          <Dropdown.Toggle
            className=" dropdown-toggle p-3"
            variant="outline-dark"
          >
            Project Type : {projectType}
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu dropdown-menu-light">
            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                setProjectType('All');
              }}
            >
              All
            </Dropdown.Item>

            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                setProjectType('Fixed');
              }}
            >
              Fixed
            </Dropdown.Item>
            <Dropdown.Item
              className="dropdown-item"
              onClick={() => {
                setProjectType('T&M');
              }}
            >
              T&M
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </span>
      <br></br>
      <TotalDMR poDetails={po}></TotalDMR>
    </Container>
  );
};

export default Total;

Total.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
