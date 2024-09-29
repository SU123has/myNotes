import { useEffect, useState } from "react";
//this custom hook helps in synchronising the state with localStorage

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  //if you pass a function as initialState, it will be treated as an initializer function
  //It should take no arguments, and return a value of any type,
  //react will call your initializer function when initializing the component and store its return value as the initial state
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    //the initializer function checks if there is a vlaue in localStorage for the given key
    //runs only once on component initialization
    if (jsonValue === null) {
      //no entry for key found
      if (typeof initialValue === "function") {
        //if initialValue is function
        return (initialValue as () => T)();
      } else {
        //if initialValue is a direct value
        return initialValue;
      }
    } else {
      //entry found in LocalStorage, return its value
      return JSON.parse(jsonValue);
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as [T, typeof setValue];
}

//if initializer function is not used, the code to determine the initial function would run on every render, even though
// the initial state needs to be determined only once. This is inefficient and can lead to performance issues if initialization
//logic is complex or involves expensive computation

// Execution Flow with Initializer Function
// Component Mounts:
// The component mounts and the useLocalStorage hook is called.
// The initializer function inside useState runs once to set the initial state.

// First Render:
// The component renders with the initial state.
// The initializer function does not run again.

// Subsequent Renders:
// The component re-renders due to state updates.
// The initializer function does not run again, avoiding unnecessary computations.
