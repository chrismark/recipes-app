import { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';

const AutoHideToast = ({ children, delay }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 1500);  
  }, []);
  
  return (
    <Toast onClose={() => setShow(false)} show={show} delay={delay} autohide={true}>
        {children}
    </Toast>
  );
};

AutoHideToast.defaultProps = {
  delay: 3000
};

export default AutoHideToast;