import React, { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import RenderScreen from './RenderScreen'; 


const LoadScreen = () => {


const [screenParam, setScreenParam] = useState('initialParam');
  
const [searchParams, setSearchParams] = useSearchParams();


const scrid = searchParams.get("scrid");
const stgid = searchParams.get("stgid");
const ver = searchParams.get("ver");
const qid = searchParams.get("qid");

debugger;

// Set a unique key to force re-render of RenderScreen when URL params change
const key = `${scrid}-${stgid}-${guidGenerator()}`;

  return (
    <div key={key}>
      <RenderScreen scrid={scrid} stgid={stgid} formKey={key} qid={qid} />
    </div>
  );
};

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export default LoadScreen;
