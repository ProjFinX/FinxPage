
import React  from "react";


export   function BranchRoleNodetojson(arr1,nodeselected){
 
  let obj = "";
  let obj1 = {};

  let parent=[];
  let child=[];
  let arr2=[];  
  let nodearr=[];

      arr1.forEach(arr1item => {    
        
        child = [];
       
        arr2 = nodeselected;
       
        arr2.forEach(arr2item => {
             
             

                    nodearr = arr2item.split('-') 

                    console.log(nodearr)

                    if    (arr1item.BranchId ==  nodearr[1])
                    {              
                      child= [...child,nodearr[0]] 
                    }
      } 
      
      );

      obj1= {BranchId:arr1item.BranchId,RoleIds:child}

      parent = [...parent,obj1]

  } )

  console.log(parent);
  
 return parent;

}






export   function UserBranchRoleNodetojson(arr1,nodeselected){
 
  let obj = "";
  let obj1 = {};

  let parent=[];
  let child=[];
  let arr2=[];  
  let nodearr=[];

      arr1.forEach(arr1item => {                
       
        child = [];
        arr2 = nodeselected;
       
        arr2.forEach(arr2item => {
             
                    

                    nodearr = arr2item.split('-') 

                    console.log(nodearr)

                    if    (arr1item.BranchId ==  nodearr[1] )
                    {              
                      child= [...child,nodearr[0]] 
                    }
      } 
      
      );

      obj1= {BranchId:arr1item.BranchId,RoleMapIds:child}

      parent = [...parent,obj1]

  } )

  console.log(parent);
  
 return parent;

}
