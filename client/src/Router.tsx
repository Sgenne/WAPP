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
      <Route path="/thread/:threadId" element={<ThreadPage />} />
      <Route path="/create-thread/:category" element={<CreateThread />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="*" element={<div>Uh oh... No page was found 😿</div>} />
    </Routes>
  );
};

export default Router;
