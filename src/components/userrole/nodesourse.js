
import React  from "react";





export   function BranchRoleMapNodeSource(arr1,arr2){
 
  let obj = {};
  let obj1 = {};

  let parent=[];
  let child=[];


  console.log(arr1)
  console.log(arr2)


      arr1.forEach(arr1item => {



      arr2.forEach(arr2item => {
        obj1 = {'value': arr2item.RoleId +'-' + arr1item.BranchId,'label':arr2item.RoleName};  
        child= [...child,obj1]       
      }  
      
      );
  
      obj = {'value': arr1item.BranchId,'label':arr1item.Name,'children':child};
      
      parent = [...parent,obj]



      child= []  

  } )

 return parent;

};


export   function UserBranchRoleMapNodeSource(arr1){
 
  let obj = {};
  let obj1 = {};

  let parent=[];
  let child=[];
  let arr2 = [];


  console.log(arr1)
  console.log(arr2)


      arr1.forEach(arr1item => {

       arr2 = arr1item.Roles;

      arr2.forEach(arr2item => {
        obj1 = {'value': arr2item.BRMapId +'-' + arr1item.BranchId,'label':arr2item.RName};  
        child= [...child,obj1]       
      }  
      
      );
  
      obj = {'value': arr1item.BranchId,'label':arr1item.Name,'children':child};
      
      parent = [...parent,obj]

      child= []  

  } )  

 return parent;

}



export   function statuschangeRoleMapNodeSource(Rolearr){
 
  let obj = {};
  let parent=[];



  console.log('Rolearr',Rolearr)


  Rolearr.forEach(arr1item => {

      

        var staus =  arr1item.BRUMapStatus; 
             
        obj = {'value': arr1item.RoleId ,'label': " " +  arr1item.RoleName + ' ('  + staus + ')' , showNodeIcon:false};  
     
      
      parent = [...parent,obj]    

  } )  

 return parent;

}


