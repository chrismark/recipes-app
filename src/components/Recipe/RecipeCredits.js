import { Row, Col, Image, ListGroup, ListGroupItem } from 'react-bootstrap';

const RecipeBrandCredits = ({ credits }) => {
  return (
    <Row className='recipe-credits'>
      <Col>
        <ListGroup horizontal flush='true'>
          <ListGroupItem style={{border: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0}}>
            <Image src={credits[0].image_url} style={{maxHeight: '12vh'}} fluid />
          </ListGroupItem>
          <ListGroupItem style={{border: 0, paddingLeft: '1vw', paddingRight: 0, paddingTop: 0, paddingBottom: 0}}>
            <div className='h5' style={{marginBottom: 0, alignItems: 'start'}}>Presented by</div>
            <div className='h3 fw-bolder'>{credits[0].name}</div>
          </ListGroupItem>
        </ListGroup>
      </Col>
    </Row>
  );
};

const RecipeNonBrandCredits = ({ credits }) => {
  const listCredits = (credits) => {
    // if credits is ['a', 'b', 'c']
    return credits.reduce((prev, cur, idx) => {
      if (idx === 0) { // outputs 'a'
        return cur.name ? cur.name : '';
      }
      else if (idx === credits.length - 1) { // outpus ', b' then ' & c'
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
  return names.length > 0 ?
    (
      <Row className='recipe-credits'>
        <Col>
          <h4 style={{marginBottom: 0}} className='fw-bolder'>{names}</h4>
          <h5>{type}</h5>
        </Col>
      </Row>
    )
    : ''
  ;
};

const RecipeCredits = ({ recipe }) => {
  return (recipe && recipe.credits && recipe.credits.length > 0) ? 
    (recipe.credits[0].type === 'brand' 
        ? <RecipeBrandCredits credits={recipe.credits} /> 
        : <RecipeNonBrandCredits credits={recipe.credits} />)
    : '';
};

export default RecipeCredits;