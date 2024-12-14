const FormDataHelper = {
  ProcessStageelementsData: (node, path, FormContext) => {
    if (FormContext) {
      const { getValues, stageGridRefs, stageElements, cntrData, eDefHldr } = FormContext;

      let qdata = {};

      for (const key in stageElements.elms) {
        if (typeof node[key] === "object" && node[key] !== null) {
          if (cntrData[key].ty == "14") {
            // Type 14: Perform actions for type 14
            // You can access child properties and perform specific actions here
            qdata[key] = processPopupformData(node[key]);
          } else if (cntrData[key].ty === 10) {
            // dummy for now
          }
          else if (cntrData[key].ty === 9) {
            qdata[key] = getValues(key)?.[0];
          }
          else if (cntrData[key].ty === 3) {
            qdata[key] = getValues(key);
          }
          else {
            // Handle other types as needed
            qdata[key] = getValues(key);
          }
        }
      }

      for (const k in eDefHldr?.elmsData) {


        if (cntrData[k] && cntrData?.[k]?.ty === 9) {
          qdata[k] = eDefHldr.elmsData[k]?.[0];
        }
        else {
          qdata[k] = eDefHldr.elmsData[k];
        }
        // Handle other types as needed

      }



      function processPopupformData(parentNode) {
        const popupformData = {}; // Store the data for pop_EmpDetail's child objects
        for (const childKey in parentNode.child) {
          if (typeof parentNode.child[childKey] === "object") {
            // Assume some function getDataForChildObject is used to get data for each child
            if (cntrData[childKey].ty != "10") {
              const childData = getValues(childKey);
              popupformData[childKey] = childData;
            }
          }
        }
        return popupformData;
      }

      return qdata;
    }
  } /* Fetch Grid data */,

  ProcessStageGridData: (FormContext) => {
    if (FormContext) {
      const { getValues, stageGridRefs, stageElements, cntrData } = FormContext;

      let griddata = {};

      for (var key in stageGridRefs) {
        let rowData = {};
        stageGridRefs[key].current.api.forEachNode((node) =>
          Object.assign(rowData, { [node.data._rid]: node.data })
        );
        griddata[key] = rowData;
      }

      return griddata;
    }
  },
};

export default FormDataHelper;
