// libraries
import type { FC } from 'react';
import { type Control, Controller } from 'react-hook-form';
import { FormGroup, InputGroup, Intent } from '@blueprintjs/core';

interface FormInputFieldProps {
  name: string;
  control: Control;
  placeholder: string;
  label?: string;
  type?: string;
  error?: any;
  onChange?: () => void;
}

export const FormInputField: FC<FormInputFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  error,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormGroup
        helperText={error}
        intent={error ? Intent.DANGER : Intent.NONE}
        label={label}
        labelFor={`${name}-input`}
      >
        <InputGroup
          id={`${name}-input`}
          placeholder={placeholder}
          type={type}
          {...field}
          intent={error ? Intent.DANGER : Intent.NONE}
        />
      </FormGroup>
    )}
  />
);
