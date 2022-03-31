import Posts from './Posts';
import MainContainer from './MainContainer';

const Home = ({ user }) => {
  return (
    <MainContainer user={user}>
      <Posts user={user} />
    </MainContainer>
  );
};

export default Home;