import Posts from './Posts';
import MainContainer from './MainContainer';

const Home = ({ user }) => {
  console.log('render Home');
  return (
    // <MainContainer user={user}>
       <Posts user={user} />
    // </MainContainer>
  );
};

export default Home;