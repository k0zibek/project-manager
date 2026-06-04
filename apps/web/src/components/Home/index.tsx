// libraries
import {
  type ChangeEvent, type FC, useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  Card, InputGroup, Intent, Spinner,
} from '@blueprintjs/core';
// components
import { PaginationControls } from 'components/Home/PagiationControls';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
import { LinkButton } from 'components/shared/LinkButton';
// config
import { PROJECT_FIELDS, PROJECT_VALIDATION_SCHEMA } from 'components/Home/config';
// store
import type { RootState } from 'context/store';
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';
// hooks
import { useCreateProject, useProjects } from 'features/projects/hooks/useProjects';

import { getErrorMessage } from 'shared/errors/getErrorMessage';

export const Home: FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  const isAuthenticated = authStatus === 'authenticated';
  const { toaster } = useToasterContext();
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6 });

  const {
    data: projects = [],
    isLoading,
    isError,
    error,
  } = useProjects(isAuthenticated);

  const createProject = useCreateProject();

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filteredProjects = query === ''
    ? projects
    : projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()));

  const totalPages = Math.ceil(filteredProjects.length / pagination.pageSize);

  if (pagination.page > totalPages && totalPages > 0) {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }

  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pagination.pageSize);

  const handleProjectSubmit = async (values: Record<string, string>) => {
    try {
      await createProject.mutateAsync({
        name: values.name,
        description: values.description,
      });
    } catch (err) {
      const message = getErrorMessage(err);

      toaster?.show({ message: `Ошибка при создании проекта: ${message}`, intent: 'danger' });
    }
  };

  if (isAuthenticated && isLoading) {
    return (
      <div className="loader-container">
        <Spinner
          aria-label="Loading..."
          intent={Intent.NONE}
          size={35}
        />
      </div>
    );
  }

  if (isAuthenticated && isError) {
    const message = getErrorMessage(error, 'Не удалось загрузить проекты');

    return (
      <div className="error-container">
        {`Ошибка загрузки проектов с сервера: ${message}`}
      </div>
    );
  }

  return (
    <div className="home-container">

      <div className="home-intro">

        {
          isAuthenticated && (
          <ButtonWithDialogForm
            buttonText="Добавить проект"
            dialogTitle="Новый проект"
            fields={PROJECT_FIELDS}
            icon="add"
            onSubmit={handleProjectSubmit}
            validationSchema={PROJECT_VALIDATION_SCHEMA}
          />
          )
        }

        <div className="search-input-container">
          <InputGroup
            className="search-input"
            fill
            leftIcon="search"
            name="search"
            onChange={inputHandler}
            placeholder="Поиск проекта"
            value={query}
          />
        </div>
      </div>

      <div className="projects-container">
        {
          paginatedProjects.length
            ? paginatedProjects.map((item) => (
              <div key={item.id} className="project-card">
                <Card>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <LinkButton icon="more" intent={Intent.PRIMARY} link={`/project/${item.id}`} text="more" />
                </Card>
              </div>
            ))
            : (
              <div>{isAuthenticated ? 'Результата нет' : 'Войдите, чтобы увидеть свои проекты'}</div>
            )
        }
      </div>

      {isAuthenticated && (
        <PaginationControls
          length={filteredProjects.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}

    </div>
  );
};
