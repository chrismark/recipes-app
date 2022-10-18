import ReactTimeAgo from 'react-time-ago';

const TimeAgo = ({ date }) => {
  return (
    <small className='text-muted'>
      <ReactTimeAgo date={date} locale='en-US' timeStyle='minute-now' />
    </small>
  );
};

export default TimeAgo;