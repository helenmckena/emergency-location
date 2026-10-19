import { createBrowserRouter } from 'react-router-dom';

import { OperatorPage } from '../../pages/operator/OperatorPage';
import { OperatorRequestPage } from '../../pages/operator/OperatorRequestPage';
import { UserPage } from '../../pages/user/UserPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <OperatorPage />,
  },
  {
    path: '/operator',
    element: <OperatorPage />,
  },
  {
    path: '/operator/:requestId',
    element: <OperatorRequestPage />,
  },
  {
    path: '/request/:requestId',
    element: <UserPage />,
  },
]);