import { useEffect, useState, useReducer } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

const toastReducer = (state, {type, payload}) => {
  console.log('toastReducer: ', type, payload, state);
  switch (type) {
    case 'enqueue': // increase visible toasts
      return {
        visible: state.visible + 1, 
        toasts: [...state.toasts, { id: new Date().valueOf(), message: payload }]
      };
    case 'dequeue': // decrease visible toasts
      let visible = Math.max(state.visible - 1, 0);
      console.log('visible: ', visible);
      // if visible is 0 the set toasts to an empty array
      return { visible, toasts: visible == 0 ? [] : state.toasts };
  }
  return state;
};
const dispatchPointer = { call: undefined };

const dispatch = (action) => {
  if (dispatchPointer.call) {
    dispatchPointer.call(action);
  }
};

export const toast = (message) => {
  dispatch({type: 'enqueue', payload: message});
};

export const useStore = () => {
  const [toasts, dispatch] = useReducer(toastReducer, { visible: 0, toasts: [] });

  useEffect(() => {
    console.log('Toaster useStore');
    if (dispatchPointer.call == undefined) {
      dispatchPointer.call = dispatch;
    }
  }, [toasts]);

  return toasts;
};

const AutoHideToast = ({ children, delay, onClose }) => {
  const [show, setShow] = useState(true);  
  return (
    <Toast onClose={() => { setShow(false); onClose(); }} show={show} delay={delay} autohide={true}>
        {children}
    </Toast>
  );
};

AutoHideToast.defaultProps = {
  delay: 5000
};

export const Toaster = ({ delay }) => {
  console.log('render Toaster');
  const store = useStore();
  useEffect(() => {
    console.log('Toaster mount');
    return () => console.log('Toaster unmount');
  }, []);
  return (
    <ToastContainer className='position-fixed' position='top-center' style={{marginTop: '.5vh', zIndex: 9999999}}>
      {store.toasts.map(toast => (
        <AutoHideToast key={toast.id} delay={delay} onClose={() => dispatch({type: 'dequeue'})}>
          <Toast.Body>{toast.message}</Toast.Body>
        </AutoHideToast>
      ))}  
    </ToastContainer>
  );
}