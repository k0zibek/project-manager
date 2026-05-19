// libraries
import {
  type Control, Controller, type FieldValues, type Path,
} from 'react-hook-form';
import { FormGroup, HTMLSelect, Intent } from '@blueprintjs/core';

interface FormSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

/** Controlled select wired to react-hook-form */
export const FormSelectField = <T extends FieldValues>({
  control,
  name,
  label,
  error,
  options,
}: FormSelectFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormGroup
        helperText={error}
        intent={error ? Intent.DANGER : Intent.NONE}
        label={label}
        labelFor={`${String(name)}-select`}
      >
        <HTMLSelect
          id={`${String(name)}-select`}
          {...field}
          options={options}
        />
      </FormGroup>
    )}
  />
  );
