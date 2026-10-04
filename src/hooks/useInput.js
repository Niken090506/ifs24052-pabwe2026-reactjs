import { useState } from "react";

export default function useInput(defaultValue = "") {
  const [value, setValue] = useState(defaultValue);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return [value, onChange, setValue];
}