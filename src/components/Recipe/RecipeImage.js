import { Figure } from 'react-bootstrap';

const RecipeImage = ({ src, maxHeight }) => {
  const figureImgStyle = {
    maxHeight: maxHeight ? maxHeight : '60vh'
  };

  return (
    <Figure className='recipe-image mb-0'>
      <Figure.Image src={src} className='mb-0' style={figureImgStyle} />
    </Figure> 
  );
};

export default RecipeImage;