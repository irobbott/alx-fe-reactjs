import { useRecipeStore } from "./recipeStore";

const RecipeList = () => {
  const recipes = useRecipeStore((state) => state.filteredRecipes);
  const addFavorite = useRecipeStore((state) => state.addFavorite);

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          <button onClick={() => addFavorite(recipe.id)}>
            Add to Favorites
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipeList;