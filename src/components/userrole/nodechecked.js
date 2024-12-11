
import React  from "react";





export   function BranchRoleNodeChecked(arr1){
 
  let obj = "";
  let obj1 = {};

  let parent=[];
  let child=[];
  let arr2=[];


      arr1.forEach(arr1item => {

        arr2 = arr1item.Roles;
       
      arr2.forEach(arr2item => {
        obj =  arr2item.RId + '-' + arr1item.BranchId ;  
        child= [...child,obj]       
      }  
      
      );

  } )
  
 return child;

}

export   function UserBranchRoleNodeChecked(arr1,filterbrmap){
 
  let obj = "";
  let obj1 = {};

  let parent=[];
  let child=[];
  let arr2=[];
    
  console.log(filterbrmap)
    
    filterbrmap.forEach(filterbrmapitem=>{
                        console.log(filterbrmapitem.BRMapId)

                                        arr1.forEach(arr1item => {

                                          arr2 = arr1item.Roles;
                                        
                                        arr2.forEach(arr2item => {
                                          if (filterbrmapitem.BRMapId == arr2item.BRMapId && filterbrmapitem.BRUMapStatusId ==1 )
                                          {
                                            obj =  arr2item.BRMapId + '-' + arr1item.BranchId ;  
                                            child= [...child,obj]   

                                          }
                                            
                                        }  
                                        
                                        );
                                  
                                    } )
                        }
                        )
  
 return child;

}

