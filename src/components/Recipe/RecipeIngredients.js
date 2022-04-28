import { Row, Col } from 'react-bootstrap';

const Component = ({ data: component }) => {
  let ingredient = '';
  // Prefer to display imperial units with metric units inside parenthesis
  const unitIndex = component.measurements[0].unit.system === 'imperial' ? 0 : (component.measurements.length > 1 ? 1 : 0);
  const altUnitIndex = unitIndex === 0 ? 1 : 0;
  const quantity = parseInt(component.measurements[unitIndex].quantity);

  if (component.measurements[unitIndex].quantity >= 1 || component.measurements[unitIndex].quantity != 0) {
    ingredient += `${component.measurements[unitIndex].quantity} `;
  }
  if (quantity === 0 || quantity === 1 || isNaN(quantity)) {
    ingredient +=  `${component.measurements[unitIndex].unit.display_singular} `;
  }
  else {
    ingredient +=  `${component.measurements[unitIndex].unit.display_plural} `;
  }
  ingredient +=  `${component.ingredient.name}`;

  return (
    <Col className='fs-5 mb-1'>
      {ingredient}
      {component.measurements.length > 1 
        ? (component.measurements[altUnitIndex].quantity > 1 ?
          ` (${component.measurements[altUnitIndex].quantity} ${component.measurements[altUnitIndex].unit.display_plural})` 
          :
          ` (${component.measurements[altUnitIndex].quantity} ${component.measurements[altUnitIndex].unit.display_singular})` 
        )
        : ''
      }
      {component.extra_comment.length > 0 ? `, ${component.extra_comment}` : ''}
    </Col>
  );
};

const Section = ({ recipeId, index, data: section }) => {
  const sectionName = (section.name && section.name.length > 0) ? section.name.toUpperCase() : null;

  return (
    <div className='recipe-ingredient-section'>
      {sectionName ? (
        <h5 className='fw-bold mt-4'>{sectionName}</h5>
      ) : (
        <div className='mt-3'></div>
      )}
      <Row xs={1}>
        {section.components/*.filter(component => component.raw_text !== 'n/a')*/.map(component => (
          <Component data={component} key={`${recipeId}-${component.id}`} />
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
        <Section recipeId={recipe.id} index={index} data={section} key={`${recipe.id}-section-${index}`} />
      )) : ''}
    </>
  );
};

export default RecipeIngredients;