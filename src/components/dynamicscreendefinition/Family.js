import React, { useState } from "react";


export default function Family({ familyTree }) {
  const [isVisible, setIsVisible] = useState(false);
  const expand = () => {
    setIsVisible(!isVisible);
  };

  const familyTree1 = {
    //Grandfather
    name: "John",
    age: 90,
    children: [
      {
        name: "Mary",
        age: 60,
      },
      {
        name: "Arthur",
        age: 60,
        children: [
          {
            name: "Lily",
            age: 35,
            children: [
              {
                name: "Hank",
                age: 60,
              },
              {
                name: "Henry",
                age: 57,
              },
            ],
          },
          {
            name: "Billy",
            age: 37,
          },
        ],
      },
      {
        name: "Dolores",
        age: 55,
      },
    ],
  };

  
  return (
    <>
      <span onClick={expand}>{familyTree.name}</span>
      {isVisible ? (
        familyTree?.children?.map((child) => {
          return (
              <Family familyTree={child} />
          );
        })
      ) : (
        <></>
      )}
    </>
    
  );
}
