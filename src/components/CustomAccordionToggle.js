import { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

const CustomAccordionToggle = ({ children, eventKey }) => {
  const [expandText, setExpandText] = useState(false)
  const decoratedOnClick = useAccordionButton(eventKey, () => { 
    setExpandText(!expandText);
  });
  return (
    <span className='h5 cursor-pointer' onClick={decoratedOnClick}>
      {children} <span className='h4'>{expandText ? (<IoIosArrowDropdown />) : (<IoIosArrowDropup />)}</span>
    </span>
  );
};

export default CustomAccordionToggle;