import React from "react";

const Footer = () => {
  const onChange = (e) => {
    console.log(e.target.files);
  };
  
  return (
    <form>
      <input type="file" id="dasdsadasdas" multiple onChange={onChange} />
    </form>
  );
};

export default Footer;
