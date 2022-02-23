import axios, { AxiosResponse } from "axios";
import CategoryPreview from "./CategoryPreview";
import { Category } from "../../../server/src/model/category.interface";
import { useEffect, useState } from "react";

const Home = () => {
  const [categories, setCategetories] = useState<Category[]>([]);

  async function getCat() {
    try {
      categoryResult = await axios.get<{
        message: string;
        categories?: Category[];
      }>("http://localhost:8080/thread/categories", {});
    } catch (error) {
      console.log(error);
    }

    console.log("fetched categories: ", categoryResult.data.categories);

    setCategetories(categoryResult.data.categories);
  }

  let categoryResult: AxiosResponse;

  useEffect(() => {
    getCat();
  }, []);

  const categoryPreviewComponents = categories.map((cat) => (
    <span key={cat.CategoryId}>
      <CategoryPreview category={cat} />
    </span>
  ));

  return (
    <div className="wholePage">
      <ul>{categoryPreviewComponents}</ul>
    </div>
  );
};

export default Home;
