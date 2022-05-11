import { Row, Col } from 'react-bootstrap';
import { FaRegClock } from 'react-icons/fa';

const toHrMin = (minutes, minimize) => {
  if (minutes < 60) {
    return minimize ? `${minutes}m` : `${minutes} min`;
  }
  else {
    const hr = Math.floor(minutes / 60);
    const min = minutes % 60;
    return minimize ? `${hr}h` + (min > 0 ? ` ${min}m` : '') : `${hr} hr` + (min > 0 ? ` ${min} min` : '');
  }
};

const CompleteTime = ({ recipe, minimize }) => {
  const fsClass = minimize ? 'fs-6' : 'fs-5';
  return (
    <Row className={'recipe-time mt-2 ' + (minimize ? 'gx-1 text-center' : '')}>
      <Col>
        <div className='fw-bold'>Total{!minimize && ' Time'}</div>
        <div className={fsClass}>{toHrMin(recipe.total_time_minutes, minimize)}</div>
      </Col>
      <Col>
        <div className='fw-bold'>Prep{!minimize && ' Time'}</div>
        <div className={fsClass}>{toHrMin(recipe.prep_time_minutes, minimize)}</div>
      </Col>
      <Col>
        <div className='fw-bold'>Cook{!minimize && ' Time'}</div>
        <div className={fsClass}>{toHrMin(recipe.cook_time_minutes, minimize)}</div>
      </Col>
      {!minimize && (<>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </>)}
    </Row>
  )
};

CompleteTime.defaultProps = {
  minimize: false
};

const TotalCookTime = ({ display }) => {
  return (
    <div  className='mt-2'>
      <FaRegClock /> <span className='fw-bold' style={{verticalAlign: 'middle'}}>{display}</span>
    </div>
  );
};

const RecipeTimeInMinutes = ({ recipe, minimize }) => {
  const hasTotalTime = recipe.total_time_minutes !== null;
  const hasPrepTime = recipe.prep_time_minutes !== null;
  const hasCookTime = recipe.cook_time_minutes !== null;
  const hasTotalTimeTier = recipe.total_time_tier !== null;

  if (hasTotalTime && hasPrepTime && hasCookTime) {
    return (<CompleteTime recipe={recipe} minimize={minimize} />);
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

RecipeTimeInMinutes.defaultProps = {
  minimize: false
};

export default RecipeTimeInMinutes;