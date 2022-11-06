import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

const CreateEditPostModalLauncher = ({text, onClick}) => {
  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Control
            readOnly={true}
            value={text}
            className='cursor-pointer rounded-pill'
            onClick={onClick}
            />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateEditPostModalLauncher;