import React, { useState, useEffect } from "react";

const ProvinceStateMaster = () => {
 const [hasError, setErrors] = useState(false);
const [ProvinceState, setProvinceState] = useState({});

  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    const res = await fetch("https://jsonplaceholder.typicode.com/Posts");
    res
      .json()
      .then(res => setProvinceState(res))
      .catch(err => setErrors(err));
  }
  return ( JSON.stringify(ProvinceState)
    // <div>
    //   <span>{JSON.stringify(ProvinceState)}</span>
    //   <hr />
    //   <span>Has error: {JSON.stringify(hasError)}</span>
    // </div>
  );
};
export default ProvinceStateMaster;