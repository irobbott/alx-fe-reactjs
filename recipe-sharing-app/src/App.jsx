import { BrowserRouter, Routes, Route } from "react-router-dom";

import SearchBar from "./components/SearchBar";
import AddRecipeForm from "./components/AddRecipeForm";
import RecipeList from "./components/RecipeList";
import FavoritesList from "./components/FavoritesList";
import RecommendationsList from "./components/RecommendationsList";
import RecipeDetails from "./components/RecipeDetails";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <h1>Recipe Sharing App</h1>

        <SearchBar />
        <AddRecipeForm />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <RecipeList />
                <FavoritesList />
                <RecommendationsList />
              </>
            }
          />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;