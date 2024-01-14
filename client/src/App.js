import './App.css';
import {BrowserRouter as Router,Link,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Home_MIS from './pages/Home_MIS'
import Home_Dean from './pages/Home_Dean'
import Profile from './pages/Profile'
function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/admin' element={<Home_MIS/>}></Route>
        <Route path='/dean' element={<Home_Dean/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
     </Router>
    </div>
  );
}

export default App;
