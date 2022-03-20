import { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';

const CustomAccordionToggle = ({ eventKey }) => {
  const [expandText, setExpandText] = useState(false)
  const decoratedOnClick = useAccordionButton(eventKey, () => { 
    setExpandText(!expandText);
  });
  return (
    <small className='' onClick={decoratedOnClick}>{expandText ? (<FaAngleDoubleDown />) : (<FaAngleDoubleUp />)}</small>
  );
};

export default CustomAccordionToggle;