import React from "react";
import TextBox from "./controls/TextBox";
import ComboBox from "./controls/ComboBox";
import NumericBox from "./controls/NumericBox";
import DateBox from "./controls/DateBox";
import DateTimeBox from "./controls/DateTimeBox";
import CheckBox from "./controls/CheckBox";
import RadioButton from "./controls/RadioButton";
import File from "./controls/File";
import Label from "./controls/Label";
import MultiLineTextBox from "./controls/MultiLineTextBox";
import Button from "./controls/Button";
import Grid from "./controls/Grid";
import PopupForm from "./controls/PopupForm";
import Footer from "../Layout/footer";
import HTMLRenderer from "./controls/HTMLRenderer";
import FormGrid from "./controls/FormGrid";

const OneScreen = ({ dataprops, fieldname, stagelementdata, elementdefs , cls , childUI ,rid , dv}) => {
  switch (dataprops.ty) {
    case 1:
      return (
        <TextBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
             cls
          }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 2:
      return (
        <NumericBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 3:
      return (
        <ComboBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          cod={dataprops.cod}
          rid = {rid}
        />
      );
    case 4:
      return (
        <DateBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 5:
      return "TimeStamp";
    case 6:
      return (
        <DateTimeBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
         rid = {rid}
        />
      );
    case 7:
      return (
        <CheckBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 8:
      return (
        <RadioButton
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          rid = {rid}
        />
      );
    case 9:
      return (
        <File
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 10:

      if(dataprops.fgr){
        return (
          <>
            {" "}
            <FormGrid
              coldef={dataprops}
              cntrlsdata={elementdefs}
              stagelementdata={stagelementdata}
              fieldname={fieldname}
              childUI = {childUI}
              rid = {rid}
            ></FormGrid>{" "}
          </>
        );

      }
      return (
        <>
          {" "}
          <Grid
            coldef={dataprops}
            cntrlsdata={elementdefs}
            stagelementdata={stagelementdata}
            fieldname={fieldname}
            childUI = {childUI}
            rid = {rid}
          ></Grid>{" "}
        </>
      );

    case 11:
      return (
        <Label eid={dataprops.eid} fieldname={fieldname} cap={dataprops.cap} />
      );
    case 12:
      return (
        <MultiLineTextBox
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          rid = {rid}
        />
      );
    case 13:
      return (
        <Button   eid={dataprops.eid}
        fieldname={fieldname}
        cap={dataprops.cap}
        col={
           cls
        }
        mn={
          stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
        }
        val={dataprops.val}
        mxLen={
          stagelementdata.prp[fieldname] &&
          stagelementdata.prp[fieldname].mxLen
        }
        ev={
          stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
        }
        rid = {rid}
     />
      );
    case 14:
      return (
        <PopupForm
          eid={dataprops.eid}
          fieldname={fieldname}
          cap={dataprops.cap}
          col={
            cls
         }
          mn={
            stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
          }
          val={dataprops.val}
          mxLen={
            stagelementdata.prp[fieldname] &&
            stagelementdata.prp[fieldname].mxLen
          }
          ev={
            stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
          }
          defs={dataprops}
          elementdefs={elementdefs}
          stagelementdata={stagelementdata}
          childUI = {childUI}
          rid = {rid}
        />
      );

      case 16:
        return (
          <HTMLRenderer
            eid={dataprops.eid}
            fieldname={fieldname}
            cap={dataprops.cap}
            col={
              cls
           }
            mn={
              stagelementdata.prp[fieldname] && stagelementdata.prp[fieldname].mn
            }
            val={dataprops.val}
            mxLen={
              stagelementdata.prp[fieldname] &&
              stagelementdata.prp[fieldname].mxLen
            }
            ev={
              stagelementdata.cev[fieldname] && stagelementdata.cev[fieldname].ev
            }
            rid = {rid}
            dv = {dv}
          />
        );

      
    default:
      return null;
  }
};
export default OneScreen;
