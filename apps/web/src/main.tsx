// libraries
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// components
import App from 'components/App';
import { ToasterProvider } from 'hooks/ToasterProvider';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
// styles
import 'styles/index.scss';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </BrowserRouter>,
);
