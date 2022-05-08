import { Row, Col } from 'react-bootstrap';

const RecipePreparation = ({ recipe }) => {
  return recipe.instructions && recipe.instructions.length > 0 ? (
    <div className='recipe-preparation'>
      <h4 className='fw-bolder'>Preparation</h4>
      <Row as='ol' xs={1}>
        {recipe.instructions.map(instruction => (
          <Col as='li' className='fs-5 mb-3' key={`${recipe.id}-instrn-${instruction.id}`}>
            <div>{instruction.display_text}</div>
          </Col>
        ))}
      </Row>
    </div>
  ) : (<></>);
};

export default RecipePreparation;