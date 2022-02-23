import { Route, Routes } from "react-router-dom";
import CategoryPage from "./components/CategoryPage";
import CreateThread from "./components/CreateThread";
import Home from "./components/Home";
import ProfilePage from "./components/profile/ProfilePage";
import ThreadPage from "./components/ThreadPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thread" element={<ThreadPage />} />
      <Route path="/create-thread/:category" element={<CreateThread />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/category/:category" element={<CategoryPage />} />

      {/* 
        Keep this route at bottom to catch urls that don't match anything else. 
        Replace with real 404 page.
       */}
      <Route path="*" element={<div>Uh oh... No page was found 😿</div>} />
    </Routes>
  );
};

export default Router;
