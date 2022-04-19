import { Row, Col } from 'react-bootstrap';
import { isStringNotNullOrEmpty } from '../../lib';

const RecipeDescription = ({ recipe }) => {
  return isStringNotNullOrEmpty(recipe.description) && (
    <Row className='recipe-description'>
      <Col><p className='fs-5'>{recipe.description}</p></Col>
    </Row>
  );
};

export default RecipeDescription;