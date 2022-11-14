import Posts from './Posts';
import MainContainer from './MainContainer';

const Home = ({ user }) => {
  console.log('render Home');
  return (
    user && <Posts user={user} />
  );
};

export default Home;