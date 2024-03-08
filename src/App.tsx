import React, { Suspense, useState } from "react";
import css from "./App.module.css";

const LazyContent = React.lazy(
  () => import("./components/Content/Content.tsx")
);

function App() {
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextPage = () => {
    setOffset(offset + 50);
  };

  return (
    <>
      <Suspense fallback={"Loading..."}>
        <LazyContent offset={offset} setIsLoading={setIsLoading}/>
      </Suspense>
      <button
        disabled={isLoading}
        className={isLoading ? css.disabledBtn : css.activeBtn}
        type="button"
        onClick={nextPage}
      >
        Next
      </button>
    </>
  );
}

export default App;
