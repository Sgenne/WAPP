import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Thread } from "../../../../server/src/model/thread.interface";
import ListItem from "../common/ListItem";
import { formatDate } from "../../utils/formatUtils";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const [searchResult, setSearchResult] = useState<Thread[]>([]);
  const [noResult, setNoResult] = useState(false);

  // If searching for a new term when this component is already mounted, then
  // useLocation() triggers a rerender.
  useLocation();

  const query = new URLSearchParams(window.location.search).get("query");

  useEffect(() => {
    const fetch = async () => {
      setSearchResult([]);
      setNoResult(false);

      let result: AxiosResponse<{ message: string; threads?: Thread[] }>;
      try {
        result = await axios.get(
          "http://localhost:8080/thread/search?q=" + query
        );
      } catch (error) {
        console.log(error);
        return;
      }

      const resultThreads = result.data.threads;

      if (!resultThreads || resultThreads.length === 0) {
        setNoResult(true);
        setSearchResult([]);
        return;
      }

      setSearchResult(resultThreads);
    };
    fetch();
  }, [query]);

  const searchResultItems = searchResult.map((result) => (
    <ListItem
      header={result.title}
      content={result.content}
      info={`Posted at: ${formatDate(new Date(result.date))}`}
      link={`/thread/${result.threadId}`}
      key={result.threadId}
    />
  ));

  if (noResult) {
    return (
      <div className="search-page">
        <h1>No results for "{query}"</h1>
        <div className="search-page__search-help">
          <h3>Search help</h3>
          <ul className="search-page__search-help-list">
            <li>Check your search for typos.</li>
            <li>Use more generic search terms.</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <h1>Search Result</h1>
      <ul>{searchResultItems}</ul>
    </div>
  );
};

export default SearchPage;
