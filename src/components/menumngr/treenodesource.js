
import React  from "react";





export   function BranchRoleMapNodeSource(arr1,arr2){
 
  let obj = {};
  let obj1 = {};

  let parent=[];
  let child=[];
  let title = '';


  console.log(arr1)
  console.log(arr2)


      arr1.forEach(arr1item => {
     


      arr2.forEach(arr2item => {
        
        obj1 = {'value': arr2item.RoleId +'-' + arr1item.BranchId,'label':arr2item.RoleName ,showCheckbox: false,title:title };  
        child= [...child,obj1]       
      }  
      
      );
      
      obj = {'value': arr1item.BranchId,'label':arr1item.Name,showCheckbox: false,title:title,'children':child};
      
      parent = [...parent,obj]



      child= []  

  } )

 return parent;

};


export   function MenuItemsNodeSource(sourcearr){
 
  let gropobj = {};
  let obj1 = {};
  let Retobj = {};

  let parent=[];
  let child=[];

  let Retarr = [];
  let nvalue = ''

  let title = '';
      
      let map = {}, node,node1, res = [], i, obj={},children = [], arr=[];

     

     
      sourcearr.forEach(arr1item => {

       let arr1=[]

        arr = arr1item.MnuItm;

        if (arr != null)
        {
          
 
          

        console.log('sourcearr',sourcearr)

        for (i = 0; i < arr.length; i += 1) {
          map[arr[i].MnuItmId] = i;
         
           nvalue = arr[i].MnuItmId +'-' + arr[i].MnuGrpId +'-'+ arr[i].MnuItmName  +'-'+ arr[i].Ord +'-'+ arr[i].ParentId  + '-' + arr[i].Link
           Retobj = { value:nvalue,label:arr[i]} 
           
           obj={value:nvalue,label:arr[i].MnuItmName , showCheckbox:false}
           arr1=[...arr1,obj]
          // arr1[i].children = [];
           if (arr[i].ParentId ==null)
           {
             arr[i].ParentId=0;
           }
           
       };
       

       for (i = 0; i < arr.length; i += 1) {
          node = arr[i];
          node1 = arr1[i];
          if (node.ParentId !== 0) { 
            
             if (arr1[map[node.ParentId]].children==null)
             {
              arr1[map[node.ParentId]].children = [];
             }             
             arr1[map[node.ParentId]].children.push(node1);
          }
          else {         
            child.push(node1);
          };
       };
      }
      console.log('arr1item',arr1item);
      nvalue='0-'+ arr1item.MnuGrpId +'-'+ arr1item.MnuGrpName +'-'+ arr1item.Ord +'-'+ arr1item.Link
      gropobj = {'value': nvalue,'label':arr1item.MnuGrpName,showCheckbox: false,'children':child};
      Retobj = { value:nvalue,label:arr1item } 
      parent = [...parent,gropobj] 

      child= []  

  } )  

  console.log('parent',parent);
 return parent;
 //return [parent,Retarr];

}


export   function UserBranchRoleMapNodeSource(arr1){
 
    let obj = {};
    let obj1 = {};
  
    let parent=[];
    let child=[];
    let arr2 = [];
  
        arr1.forEach(arr1item => {
  
         arr2 = arr1item.Roles;
  
        arr2.forEach(arr2item => {
          obj1 = {'value': arr2item.BRMapId,'label':arr2item.RName};  
          child= [...child,obj1]       
        }  
        
        );
    
        obj = {'value': arr1item.BranchId +'-B','label':arr1item.Name,showCheckbox: false,'children':child};
        
        parent = [...parent,obj]
  
        child= []  
  
    } )  
  
   return parent;
  
  }
  

  export   function StageBranchRoleMapNodeSource(arr1){
 
    let obj = {};
    let obj1 = {};
    let obj3= {};
  
    let parent=[];
    let child=[];
    let RWchild=[];
    let arr2 = [];
  
        arr1.forEach(arr1item => {
  
         arr2 = arr1item.Roles;
  
        arr2.forEach(arr2item => {

          let RWchild= [{'value': arr2item.BRMapId + '-R','label':'Read'},{'value': arr2item.BRMapId + '-W','label':'Write'}];

          obj1 = {'value': arr2item.BRMapId,'label':arr2item.RName ,'children':RWchild};  
          child= [...child,obj1]       
        }  
        
        );
    
        obj = {'value': arr1item.BranchId +'-B','label':arr1item.Name,showCheckbox: false,'children':child};
        
        parent = [...parent,obj]
  
        child= []  
  
    } )  
  
   return parent;
  
  }


