// libraries
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button, Dialog, DialogBody, DialogFooter, Intent,
} from '@blueprintjs/core';
import type { IconName } from '@blueprintjs/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { type ObjectSchema } from 'yup';
// components
import { FormInputField } from 'components/shared/FormInputField';
import { FormSelectField } from 'components/shared/FormSelectField';
// constants
import type { FieldDefinition } from 'constants/types';

interface ButtonWithDialogFormProps {
  buttonText?: string
  dialogTitle: string
  fields: FieldDefinition[];
  onSubmit: (values: any) => void;
  intent?: Intent,
  icon?: IconName,
  isMinimal?: boolean;
  validationSchema?: ObjectSchema<any, any, any, any>;
}

export const ButtonWithDialogForm: FC<ButtonWithDialogFormProps> = ({
  buttonText = '',
  dialogTitle,
  fields,
  onSubmit,
  intent = Intent.SUCCESS,
  icon,
  isMinimal = false,
  validationSchema,
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = fields.reduce<Record<string, string>>((acc, field) => {
    if (field.type === 'date') {
      acc[field.name] = new Date().toISOString().split('T')[0];
    } else {
      acc[field.name] = '';
    }

    return acc;
  }, {});

  const {
    handleSubmit, control, formState: { errors }, reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    shouldFocusError: false,
  });

  const handleOpen = () => setIsOpenDialog(true);
  const handleClose = () => {
    setIsOpenDialog(false);

    reset(defaultValues);
  };

  const onFormSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);

    onSubmit(data);

    handleClose();

    setIsLoading(false);
  };

  const actions = (
    <>
      <Button onClick={handleClose} text="Отмена" />
      <Button disabled={isLoading} intent={Intent.PRIMARY} text={buttonText || 'Сохранить'} type="submit" />
    </>
  );

  return (
    <>
      <Button
        icon={icon}
        intent={intent}
        minimal={isMinimal}
        onClick={handleOpen}
        text={buttonText}
      />
      <Dialog isCloseButtonShown={false} isOpen={isOpenDialog} onClose={handleClose} title={dialogTitle || buttonText}>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <DialogBody>
            {fields.map((field) => (field.type === 'select' ? (
              <FormSelectField
                key={field.name}
                control={control}
                error={errors[field.name]?.message}
                label={field.label}
                name={field.name}
                options={field.options || []}
              />
            ) : (
              <FormInputField
                key={field.name}
                control={control}
                error={errors[field.name]?.message}
                label={field.label}
                name={field.name}
                placeholder={field.placeholder}
                type={field.type}
              />
            )))}
          </DialogBody>
          <DialogFooter actions={actions} />
        </form>
      </Dialog>
    </>
  );
};
