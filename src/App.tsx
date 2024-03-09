import React, { Suspense, useCallback, useState } from "react";
import md5 from "md5";
import FilterByName from "./components/FilterByName/FilterByName.tsx";
import css from "./App.module.css";

const LazyContent = React.lazy(
  () => import("./components/Content/Content.tsx")
);

function App() {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [IDs, setIDs] = useState([]);

  const getFields = useCallback(async (action: string, params: unknown) => {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    try {
      const response = await fetch("https://api.valantis.store:41000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": md5(`Valantis_${timestamp}`),
        },
        body: JSON.stringify({
          action: action,
          params: params,
        }),
      });
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }, []);

  const nextPage = () => {
    setOffset((prev) => prev + 50);
  };

  const handlePrev = () => {
    if (offset >= 50) {
      setOffset((prev) => prev - 50);
    }
  };

  const isDisabledPrev = offset < 50 || isLoading;

  return (
    <>
      <div id={css.head}>
        <div id={css.paginWr}>
          <button
            disabled={isDisabledPrev}
            className={isDisabledPrev ? css.disabledBtn : css.activeBtn}
            type="button"
            onClick={handlePrev}
          >
            Prev
          </button>
          <span>Page {offset / 50 + 1}</span>
          <button
            disabled={isLoading}
            className={isLoading ? css.disabledBtn : css.activeBtn}
            type="button"
            onClick={nextPage}
          >
            Next
          </button>
        </div>

        <div id={css.filters}>
          <FilterByName getFields={getFields} setIDs={setIDs} />
        </div>
      </div>
      <Suspense fallback={"Loading..."}>
        <LazyContent
          IDs={IDs}
          setIDs={setIDs}
          offset={offset}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </Suspense>
    </>
  );
}

export default App;
