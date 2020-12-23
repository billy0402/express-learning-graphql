import { BrowserRouter } from 'react-router-dom';

import './App.css';
import AuthorizedUser from './AuthorizedUser';
import Users from './Users';

function App() {
  return (
    <BrowserRouter>
      <div>
        <AuthorizedUser />
        <Users />
      </div>
    </BrowserRouter>
  );
}

export default App;
