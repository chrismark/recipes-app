import { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

const CustomAccordionToggle = ({ children, eventKey, showToggle }) => {
  const [expandText, setExpandText] = useState(false)
  const decoratedOnClick = useAccordionButton(eventKey, () => { 
    setExpandText(!expandText);
  });
  return (
    <span className='h5 cursor-pointer' onClick={decoratedOnClick}>
      {children} {showToggle ? (<span className='h4'>{expandText ? (<IoIosArrowDropdown />) : (<IoIosArrowDropup />)}</span>) : ''}
    </span>
  );
};

export default CustomAccordionToggle;