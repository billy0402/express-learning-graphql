import './App.css';
import { addUser } from './api';

function App({ users = [] }) {
  return (
    <div>
      {users.map((user) => (
        <div key={user.githubLogin}>
          <img src={user.avatar} alt='avatar' />
          {user.name}
        </div>
      ))}
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default App;
