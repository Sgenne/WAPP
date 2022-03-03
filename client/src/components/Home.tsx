import axios, { AxiosResponse } from "axios";
import CategoryPreview from "./CategoryPreview";
import { Category } from "../../../server/src/model/category.interface";
import { useEffect, useState } from "react";

const Home = () => {
  const [categories, setCategetories] = useState<Category[]>([]);

  async function getCategory() {
    try {
      categoryResult = await axios.get<{
        message: string;
        categories?: Category[];
      }>("http://localhost:8080/thread/categories", {});
    } catch (error) {
      console.log(error);
    }

    setCategetories(categoryResult.data.categories);
  }

  let categoryResult: AxiosResponse;

  useEffect(() => {
    getCategory();
  }, []);

  const categoryPreviewComponents = categories.map((cat) => {
    return (
      <span key={cat.categoryId}>
        <CategoryPreview category={cat} />
      </span>
    );
  });

  return (
    <div className="wholePage">
      <ul>{categoryPreviewComponents}</ul>
    </div>
  );
};

export default Home;
