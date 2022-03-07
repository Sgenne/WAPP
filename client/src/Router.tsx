import { Route, Routes } from "react-router-dom";
import CategoryPage from "./UI/category/CategoryPage";
import CreateComment from "./UI/thread/CreateComment";
import CreateThread from "./UI/thread/CreateThread";
import Home from "./UI/Home";
import ProfilePage from "./UI/profile/ProfilePage";
import ThreadPage from "./UI/thread/ThreadPage";
import PageNotFound from "./UI/errorPages/PageNotFound";
import SearchPage from "./UI/search/SearchPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thread/:threadId" element={<ThreadPage />} />
      <Route path="/create-thread/:category" element={<CreateThread />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/create-comment/:type/:id" element={<CreateComment />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Router;
