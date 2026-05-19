// libraries
import {
  type Control, Controller, type FieldValues, type Path,
} from 'react-hook-form';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';

interface FormInputFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder: string;
  label?: string;
  type?: string;
  error?: string;
  onChange?: () => void;
}

/** Controlled text input wired to react-hook-form */
export const FormInputField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  error,
}: FormInputFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormGroup
        helperText={error}
        intent={error ? Intent.DANGER : Intent.NONE}
        label={label}
        labelFor={`${String(name)}-input`}
      >
        <InputGroup
          id={`${String(name)}-input`}
          placeholder={placeholder}
          type={type}
          {...field}
          intent={error ? Intent.DANGER : Intent.NONE}
        />
      </FormGroup>
    )}
  />
  );
