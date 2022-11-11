import Posts from './Posts';
import MainContainer from './MainContainer';

const Home = ({ user }) => {
  console.log('render Home');
  return (
    <Posts user={user} />
  );
};

export default Home;