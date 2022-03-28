import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaRegClock } from 'react-icons/fa';

const toHrMin = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  else {
    const hr = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `${hr} hr` + (min > 0 ? ` ${min} min` : '');
  }
};

const CompleteTime = ({ recipe }) => {
  return (
    <>
    <Row style={{marginTop: '1vh'}}>
      <Col>
        <div className='fw-bold'>Total Time</div>
        <div className='fs-5'>{toHrMin(recipe.total_time_minutes)}</div>
      </Col>
      <Col>
        <div className='fw-bold'>Prep Time</div>
        <div className='fs-5'>{toHrMin(recipe.prep_time_minutes)}</div>
      </Col>
      <Col>
        <div className='fw-bold'>Cook Time</div>
        <div className='fs-5'>{toHrMin(recipe.cook_time_minutes)}</div>
      </Col>
    </Row>
    </>
  )
};

const TotalCookTime = ({ display }) => {
  return (
    <>
      <FaRegClock /> <span className='fw-bold' style={{verticalAlign: 'middle'}}>{display}</span>
    </>
  );
};

const RecipeTimeInMinutes = ({ recipe }) => {
  const hasTotalTime = recipe.total_time_minutes !== null;
  const hasPrepTime = recipe.prep_time_minutes !== null;
  const hasCookTime = recipe.cook_time_minutes !== null;
  const hasTotalTimeTier = recipe.total_time_tier !== null;

  if (hasTotalTime && hasPrepTime && hasCookTime) {
    return (<CompleteTime recipe={recipe} />);
  }

  if (hasTotalTime || hasCookTime || hasTotalTimeTier) {
    let display;
    if (hasTotalTime) {
      display = toHrMin(recipe.total_time_minutes);
    }
    else if (hasCookTime) {
      display = toHrMin(recipe.cook_time_minutes);
    }
    else if (hasTotalTimeTier) {
      display = recipe.total_time_tier.display_tier;
    }
    return <TotalCookTime display={display} />;
  }

  return (<></>);
};

export default RecipeTimeInMinutes;