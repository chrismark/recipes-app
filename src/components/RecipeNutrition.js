import { Row, Col } from 'react-bootstrap';

const RecipeNutrition = ({ recipe }) => {
  return (
    <>
      {(recipe.nutrition && Object.keys(recipe.nutrition).length > 0) ? (<>
      <h4 className='fw-bolder mt-4'>Nutrition Info</h4>
      <Row xs={1}>
        {Object.keys(recipe.nutrition).filter(name => name !== 'updated_at').map(name => (
          <Col className='fs-5' key={`${recipe.id}-nutn-${name}`}>{`${name} ${recipe.nutrition[name]}`}</Col>
        ))}
        <Col className='fs-6 mt-3'>Estimated values based on one serving size.</Col>
      </Row>
    </>) : ''}
    </>
  );
};

export default RecipeNutrition;