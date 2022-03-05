import axios, { AxiosResponse } from "axios";
import CategoryPreview from "./category/CategoryPreview";
import { Category } from "../../../server/src/model/category.interface";
import { useEffect, useState } from "react";

const Home = (): JSX.Element => {
  const [categories, setCategetories] = useState<Category[]>([]);

  async function getCategory(): Promise<void> {
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

  useEffect((): void => {
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
