import { Dispatch, SetStateAction } from 'react';
import { WorkBook } from 'xlsx';

//DMR
export interface sortedData {
  ponumber: string;
  potype: string;
  date: string;
  details: DetailsEntity[];
  poname: string;
  projectName: string;
  currency: string;
  filename: string;
  id: number;
  filePath: string;
  totalRaisedAmount?: string;
  totalAmount?: string;
}
export interface DetailsEntity {
  po_description: string;
  amount: string;
  raisedAmount: string;
  dmrNo: string;
  date: string;
}

//EVC
export interface IFileUploader {
  data: string[];
  projectNames: string[];
  fileError: string;
  setData: Dispatch<SetStateAction<Array<string>>>;
  setWorkbook: Dispatch<SetStateAction<WorkBook>>;
  setFileError: Dispatch<SetStateAction<string>>;
  inputFileRef: React.RefObject<HTMLInputElement>;
  handleRemoveFile: () => void;
  setNewEVCreate: Dispatch<SetStateAction<boolean>>;
  setSheetName: Dispatch<SetStateAction<Array<string>>>;
  sheetName: string[];
  setHeader: Dispatch<SetStateAction<Array<string>>>;
}

export interface ISheetSelector {
  workbook: WorkBook;
  selectedSheetIndex: number;
  setSelectedSheetIndex: Dispatch<SetStateAction<number>>;
  setData: Dispatch<SetStateAction<Array<string>>>;
  data: string[];
  setHeader: Dispatch<SetStateAction<Array<string>>>;
}

export interface IDataTable {
  data: string[];
  headers: string[];
}

export interface IEVC {
  workbook: WorkBook;
  selectedSheetIndex: number;
  setSelectedSheetIndex: Dispatch<SetStateAction<number>>;
  setData: Dispatch<SetStateAction<Array<string>>>;
  data: string[];
  setHeader: Dispatch<SetStateAction<Array<string>>>;
}
