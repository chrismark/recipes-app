import { Figure } from 'react-bootstrap';

const RecipeImage = ({ src }) => {
  const figureImgStyle = {
    maxHeight: '50vh'
  };

  return (
    <Figure className='recipe-image mb-0'>
      <Figure.Image src={src} className='mb-0' style={figureImgStyle} />
    </Figure> 
  );
};

export default RecipeImage;