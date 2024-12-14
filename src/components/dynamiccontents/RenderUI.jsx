import React from "react";
import OneScreen from "./OneScreen";

const RenderUI = ({ data, elements, stageElements, cntrData , rid }) => {
  try {

    
    function uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    }

    
  return (
    <>
      {data.map((item) => {
        switch (item.typ) {
          case "div":
            return (
              <>
                <div className={`${item.cls}`} key={uuidv4}>
                  {item.child && item.child.length > 0 && (
                    <RenderUI
                      data={item.child}
                      elements={elements}
                      stageElements={stageElements}
                      cntrData={cntrData}
                    />
                  )}
                </div>
              </>
            );

          case "h":
            return (
              <>
                <item.tag className={`${item.cls}`}>{item.val}</item.tag>

                {item.child && item.child.length > 0 && (
                  <RenderUI
                    data={item.child}
                    elements={elements}
                    stageElements={stageElements}
                    cntrData={cntrData}
                  />
                )}
              </>
            );

          case "tab":
            return (
              <>
                <ul
                  className="nav nav-tabs"
                  id="borderedTab"
                  role="tablist"
                >
                  {item.tabs.map((x) => (
                    <li key={x.id} className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${x.cls}`}
                        id={x.id}
                        data-bs-toggle="tab"
                        data-bs-target={`#${item.tabcontent.find((element) => element.tid === x.id).id}`}
                        type="button"
                        role="tab"
                        aria-controls="home"
                        aria-selected="true"
                      >
                        {x.val}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="tab-content pt-2" id="borderedTabContent">
                  {item.tabcontent.map((y) => (
                    <div
                      className= {`tab-pane fade ${y.cls}`} 
                      id={y.id}
                      key={y.id}
                      role="tabpanel"
                      aria-labelledby={y.tid}
                    >
                      <div className="row">
                      {y.child && y.child.length > 0 && (
                        <RenderUI
                          data={y.child}
                          elements={elements}
                          stageElements={stageElements}
                          cntrData={cntrData}
                          rid = {rid}
                        />
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );

          case "input":
            return (
              <>
                <OneScreen
                  dataprops={
                    elements.find((element) => element.fieldname === item.id)
                      .elementdata
                  }
                  key={item.id}
                  fieldname={item.id}
                  stagelementdata={stageElements}
                  elementdefs={cntrData}
                  cls={item.cls}
                  childUI = {item.child}
                  rid={rid}
                  dv={item.dv}
                />
              </>
            );
            case "popup":
              return (
                <>
                  <OneScreen
                    dataprops={
                      elements.find((element) => element.fieldname === item.id)
                        .elementdata
                    }
                    key={item.id}
                    fieldname={item.id}
                    stagelementdata={stageElements}
                    elementdefs={cntrData}
                    cls={item.cls}
                    childUI = {item.child}
                    rid={rid}
                  />
                </>
              );

            case "grid":
              return (
                <>
                  <OneScreen
                    dataprops={
                      elements.find((element) => element.fieldname === item.id)
                        .elementdata
                    }
                    key={ uuidv4}
                    fieldname={item.id}
                    stagelementdata={stageElements}
                    elementdefs={cntrData}
                    cls={item.cls}
                    childUI = {item.child}
                    rid={rid}
                  />
                </>
              );

          default:
            return null;
        }
      })}
    </>
    
  );
}
catch(e){

  console.log("Error in Render UI -", e)
}
  
};

export default RenderUI;
