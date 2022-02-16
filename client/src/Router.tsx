import { Route, Routes } from "react-router-dom";
import ThreadPage from "./components/ThreadPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Hello! This is the front page!</div>} />
      <Route path="/thread" element={<ThreadPage />} />
      <Route
        path="/create-thread"
        element={<div>Hello! This is the page for creating a thread!</div>}
      />
      <Route
        path="/profile"
        element={<div>Hello! This is the profile page of a user!</div>}
      />
      {/* 
        Keep this route at bottom to catch urls that don't match anything else. 
        Replace with real 404 page.
       */}
      <Route path="*" element={<div>Uh oh... No page was found 😿</div>} />
    </Routes>
  );
};

export default Router;
