import axios, { AxiosResponse } from "axios";
import CategoryPreview from "./category/CategoryPreview";
import { Category } from "../../../server/src/model/category.interface";
import { useEffect, useState } from "react";

const Home = (): JSX.Element => {
  const [categories, setCategetories] = useState<Category[]>([]);

  useEffect((): void => {
    const getCategories = async (): Promise<void> => {
      let categoryResult: AxiosResponse;
      try {
        categoryResult = await axios.get<{
          message: string;
          categories?: Category[];
        }>("http://localhost:8080/thread/categories", {});
      } catch (error) {
        console.log(error);
        return;
      }
      setCategetories(categoryResult.data.categories);
    };
    getCategories();
  }, []);

  const categoryPreviewComponents = categories.map((category) => (
    <CategoryPreview category={category} key={category.title} />
  ));

  return (
    <div className="wholePage">
      <ul>{categoryPreviewComponents}</ul>
    </div>
  );
};

export default Home;
