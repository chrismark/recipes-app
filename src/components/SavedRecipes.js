import { useState } from 'react';
import ListSavedRecipes from './recipe/ListSavedRecipes';
import { useRecipes } from './recipeStore';

const SavedRecipes = ({ user }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const { data: recipes, error, isFetching } = useRecipes(user?.uuid, user?.token, page, 'full');
  const [activeCardId, setActiveCardId] = useState(-1);

  return (
    <ListSavedRecipes recipes={recipes} isFetchingRecipes={isFetching} isInitialLoad={isInitialLoad} activeCardId={activeCardId} />
  );
};

export default SavedRecipes;