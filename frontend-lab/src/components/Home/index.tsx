// libraries
import {
  type ChangeEvent, type FC, useEffect, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, InputGroup, Intent, Spinner,
} from '@blueprintjs/core';
// actions
import { fetchProjects, postProject } from 'context/actions/project/projectThunks';
// components
import { PaginationControls } from 'components/Home/PagiationControls';
import { ButtonWithDialogForm } from 'components/shared/ButtonWithDialogForm';
import { LinkButton } from 'components/shared/LinkButton';
// constants
import type { IProject } from 'constants/types';
// config
import { PROJECT_FIELDS, PROJECT_VALIDATION_SCHEMA } from 'components/Home/config';
// store
import type { AppDispatch, RootState } from 'context/store';
// hooks
import { useToasterContext } from 'hooks/ToasterProvider/useToasterProvider';

export const Home: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const { toaster } = useToasterContext();
  const [query, setQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 6 });

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

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
      const newProject: Omit<IProject, 'id'> = {
        name: values.name,
        description: values.description,
      };

      await dispatch(postProject(newProject)).unwrap();
    } catch (err) {
      toaster?.show({ message: `Ошибка при создании проекта: ${err}`, intent: 'danger' });
    }
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="error-container">
        {`Ошибка загрузки проектов с сервера: ${error}`}
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
              <div>Результата нет</div>
            )
        }
      </div>

      <PaginationControls length={projects.length} pagination={pagination} setPagination={setPagination} />

    </div>
  );
};
