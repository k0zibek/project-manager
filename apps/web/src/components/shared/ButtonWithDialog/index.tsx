// libraries
import { type FC, useState } from 'react';
import {
  Button, Dialog, DialogBody, type IconName,
  Intent,
} from '@blueprintjs/core';

interface ButtonWithDialogFormProps {
  dialogTitle: string,
  handleClick: () => void | Promise<void>;
  buttonText?: string,
  intent?: Intent,
  icon?: IconName,
  isMinimal?: boolean;
}

export const ButtonWithDialog: FC<ButtonWithDialogFormProps> = ({
  dialogTitle,
  handleClick,
  buttonText = '',
  intent = Intent.SUCCESS,
  icon,
  isMinimal = false,
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleOpen = () => setIsOpenDialog(true);
  const handleClose = () => setIsOpenDialog(false);

  const onConfirm = async () => {
    await handleClick();
    handleClose();
  };

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
        <DialogBody>
          <Button className="dialog-button" onClick={handleClose} text="Отмена" />
          <Button className="dialog-button" intent={intent} onClick={onConfirm} text={buttonText || 'Сохранить'} />
        </DialogBody>
      </Dialog>
    </>
  );
};
