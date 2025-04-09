// libraries
import { type FC } from 'react';
import { type Control, Controller } from 'react-hook-form';
import { FormGroup, HTMLSelect, Intent } from '@blueprintjs/core';

interface FormSelectFieldProps {
  control: Control;
  name: string;
  label: string;
  error?: any;
  options: { value: string; label: string }[];
}

export const FormSelectField: FC<FormSelectFieldProps> = ({
  control,
  name,
  label,
  error,
  options,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormGroup helperText={error} intent={error ? Intent.DANGER : Intent.NONE} label={label}>
        <HTMLSelect {...field} iconName="caret-down" options={options} />
      </FormGroup>
    )}
  />
);
