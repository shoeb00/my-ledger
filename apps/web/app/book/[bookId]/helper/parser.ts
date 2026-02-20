import Papa from 'papaparse';
import { parseIST } from '../../../lib';
import { AddTransactionRequest } from '../actions/add-transaction';

type InputRow = {
  Date: string;
  Time: string;
  Remark: string;
  Party?: string;
  'Entry By'?: string;
  Category: string;
  Mode: string;
  'Cash In': string;
  'Cash Out': string;
  Balance: string;
};
function buildTransaction(row: InputRow): AddTransactionRequest {
  const {
    Remark: description,
    Category: category,
    Mode: paymentType,
    'Cash In': cashIn,
    'Cash Out': cashOut,
    Date,
    Time,
  } = row;

  const createdAt = parseIST(Date, Time);

  const amount = cashIn && cashIn !== null ? String(cashIn) : `-${cashOut ?? 0}`;

  return {
    createdAt,
    amount,
    description,
    categoryName: category,
    paymentMethodName: paymentType,
    paymentMethodId: null,
    categoryId: null
  };
}

export function parseCsvFile(file: File): Promise<AddTransactionRequest[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<InputRow>(file, {
      escapeChar: '"',
      quoteChar: '"',
      delimiter: ',',
      newline: '',
      encoding: 'UTF-8',
      header: true,
      skipEmptyLines: true,

      transformHeader: (h: string) => h.trim(),
      transform: (v: string) => (v === '' ? null : v),

      complete: (json: { data: []; errors: Error[] }) => {
        try {
          if (json.errors.length) {
            reject(new Error(json.errors[0]?.message));
            return;
          }

          if (!json.data.length) {
            reject(new Error('File is empty'));
            return;
          }

          const transactions = json.data.map(buildTransaction);

          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      },

      error: (err: Error) => reject(err),
    });
  });
}
