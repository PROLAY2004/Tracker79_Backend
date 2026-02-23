import * as yup from 'yup';

const recordSchema = yup.object({
  date: yup.string().required('Please select a date'),

  investment: yup
    .number()
    .typeError('Investment must be a number')
    .positive('Investment must be greater than 0')
    .required('Please enter investment amount'),

  tax: yup
    .number()
    .typeError('Tax must be a number')
    .min(0, 'Tax cannot be negative')
    .required('Tax is required'),

  total: yup
    .number()
    .typeError('Total must be a number')
    .positive('Total must be greater than 0')
    .required('Total amount is required'),

  gold: yup.string().required('Please enter gold quantity or value'),
});

export default recordSchema;
