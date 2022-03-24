
import { Row, Col, Image } from 'react-bootstrap';

const RecipeBrandCredits = ({ credits }) => {
  return (
    <Row >
      <Col xs={2} className='gx-2'><Image src={credits[0].image_url} fluid /></Col>
      <Col className='gx-3'>
        <div className='h5' style={{marginBottom: 0, alignItems: 'start'}}>Presented by</div>
        <div className='h3 fw-bolder'>{credits[0].name}</div>
      </Col>
    </Row>
  );
};

const RecipeNonBrandCredits = ({ credits }) => {
  const listCredits = (credits) => {
    // if credits is ['a', 'b', 'c']
    return credits.reduce((prev, cur, idx) => {
      if (idx === 0) { // outputs 'a'
        return cur.name;
      }
      else if (idx == credits.length - 1) { // outpus ', b' then ' & c'
        return prev + ' & ' + cur.name; 
      }
      else {
        return prev + ', ' + cur.name;
      }
    }, ''); 
  };

  let type = 'Community';
  if (credits[0].type === 'internal') {
    type = 'Tasty Team';
  }
  const names = listCredits(credits);
  console.log('community credit names: ', names);
  return (
    <>
      <h4 style={{marginBottom: 0}} className='fw-bolder'>{names}</h4>
      <h5>{type}</h5>
    </>
  );
};

const RecipeCredits = ({ recipe }) => {
  return (recipe.credits[0].type === 'brand' 
        ? <RecipeBrandCredits credits={recipe.credits} /> 
        : <RecipeNonBrandCredits credits={recipe.credits} />
  );
};

export default RecipeCredits;