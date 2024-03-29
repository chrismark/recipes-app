import React from 'react';
import TimeAgo from './TimeAgo';
import { FaEllipsisH, FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    className='post-options-toggle'
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </span>
));

const PostHeader = ({ user, post, onClickEdit, hideActionButtons }) => {
  const onClickHandler = () => {
    console.log('PostHeader onClickHandler: ', post);
    onClickEdit(post);
  };
  return (
    <Row className='mb-2 post-header'>
      <Col>
        <div className='post-user fw-bold pt-0'>{post.name}</div>
        <div style={{marginTop: '-.5rem'}} className='post-timestamp'>
          <TimeAgo date={new Date(post.posted_on)} />
        </div>
      </Col>
      <Col className='text-end pt-1'>
        {!hideActionButtons && post.uuid == user.uuid &&
        <Dropdown align='end'>
          <Dropdown.Toggle as={CustomToggle} variant='link'>
            <FaEllipsisH className='cursor-pointer fs-6 fw-normal'  />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onClickHandler} className='fw-bold'><FaEdit className='fs-5 mb-1 me-2' />Edit post</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className='fw-bold'><FaRegTrashAlt className='fs-5 mb-1 me-2' />Move to trash</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        }
      </Col>
    </Row>
  );
};

PostHeader.defaultProps = {
  hideActionButtons: false,
};

export default PostHeader;