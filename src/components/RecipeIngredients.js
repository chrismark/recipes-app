import { Row, Col } from 'react-bootstrap';

const Component = ({ recipeId, data: component }) => {
  return (
    <Col className='fs-5 mb-1' key={`${recipeId}-${component.id}`}>
      {component.raw_text} 
      {component.measurements.length > 1 
        ? ` (${component.measurements[1].quantity} ${component.measurements[1].unit.display_plural})` 
        : ''}
    </Col>
  );
};

const Section = ({ recipeId, index, data: section }) => {
  const sectionName = (section.name && section.name.length > 0) ? section.name.toUpperCase() : null;

  return (
    <div className='recipe-ingredient-section' key={`${recipeId}-section-${index}`}>
      {sectionName ? (
        <h5 className='fw-bold mt-4'>{sectionName}</h5>
      ) : (
        <div className='mt-3'></div>
      )}
      <Row xs={1}>
        {section.components.filter(component => component.raw_text !== 'n/a').map(component => (
          <Component data={component} recipeId={recipeId} />
        ))}
      </Row>
    </div>
  );
};

const RecipeIngredients = ({ recipe }) => {
  return (
    <>
      <h4 className='fw-bolder mb-0'>Ingredients</h4>
      <h5>for {recipe.num_servings} {recipe.num_servings > 1 ? recipe.servings_noun_plural : recipe.servings_noun_singular}</h5>
      {recipe.sections.length > 0 ? recipe.sections.map((section, index) => (
        <Section recipeId={recipe.id} index={index} data={section} />
      )) : ''}
    </>
  );
};

export default RecipeIngredients;