import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { Thread } from "../../../../server/src/model/thread.interface";

const SearchPage = () => {
  useEffect(() => {
    const fetch = async () => {
      const query = new URLSearchParams(window.location.search).get("query");

      let searchResult: AxiosResponse;
      try {
        searchResult = await axios.get<{ message: string; threads?: Thread[] }>(
          "https://localhost/thread/search?q=" + query
        );
      } catch (error) {
        console.log(error);
        return;
      }

      console.log("searchResult: ", searchResult.data.threads);

      console.log(query);
    };
    fetch();
  }, []);

  return <div>SearchPage</div>;
};

export default SearchPage;
