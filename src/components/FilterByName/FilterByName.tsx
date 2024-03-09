import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";
import css from "./FilterByName.module.css";

type t = {
  getFields: (action: string, params: unknown) => Promise<Response | undefined>;
  setIDs: Dispatch<SetStateAction<never[]>>;
};

const FilterByName: React.FC<t> = ({ getFields, setIDs }) => {
  // const [filterFields, setFilterFields] = useState<string[]>([]);
  const [inpValue, setinpValue] = useState<string>("");

  const handleChangeInput:
    | ChangeEventHandler<HTMLInputElement>
    | undefined = (e: { target: { value: SetStateAction<string> } }) => {
    setinpValue(e.target.value);
  };

  const handleSearch = () => {
    getFields("filter", { product: inpValue }).then(async (res) => {
      const d = await res?.json();
      const IDs = d.result;

      setIDs(IDs);
    });
  };

  return (
    <div>
      <input
        type="text"
        name=""
        id={css.inp}
        title="nameInput"
        value={inpValue}
        onChange={handleChangeInput}
      />
      <button onClick={handleSearch} type="button">
        FilterByName
      </button>
    </div>
  );
};

export default FilterByName;
