// libraries
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';
import type { IconName } from '@blueprintjs/icons';

interface LinkButtonProps {
  link: string,
  intent: Intent,
  handleClick?: () => void,
  icon?: IconName,
  text: string,
  isMinimal?: boolean,
  className?: string,
}

export const LinkButton: FC<LinkButtonProps> = ({
  link,
  intent,
  handleClick,
  icon,
  text,
  isMinimal = true,
  className,
}) => (
  <Link to={link}>
    <Button
      className={className}
      intent={intent}
      minimal={isMinimal}
      onClick={handleClick}
      rightIcon={icon}
      text={text}
    />
  </Link>
);
