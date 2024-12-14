import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {FetchCombodata} from '../utilities/combodata';

const schema = yup.object().shape({
    txtBranchName: yup.string().required(),
    txtAddress: yup.string().min(8).max(500).required(),
});

const CreateBranch = () => {

   

    
        // Combo Data fetching------------------------------

        const[resbody,setresbody]= useState([]);
        const LoadCombo = async () => {
            // Update state with incremented value

            const opt = '|CUN|PSM|';
            const optw = '';
        // debugger;

        const Response = await FetchCombodata(opt,optw);// JSON.stringify(await FetchCombodata(opt,optw));

            setresbody(Response.body.psm)
            console.log('rerendering method')
        }; 

        useEffect(() => {
            LoadCombo(); 
            console.log('rerendering')
        
        },[])


        //-----------------------------


        const { register, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema),
         });

         const [branchmaster, setbranchmaster] = useState({
            
          });

     const onSubmitHandler = (data) => {
        console.log({ data });
      
         reset();
       };



    const onChange = (e) => {
        setbranchmaster({ ...branchmaster, [e.target.id]: e.target.value });
      };

    //return(<div> hai</div>)

  return (


        <>
          <section className="vh-100">
    
    
            <div className="container h-100">           
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                  <div className="card text-black" style={{ borderRadius: "25px" }}>
                        <div className="card-header">
                                <strong className="card-title">Branch</strong>
                        </div>
                    <div className="card-body p-md-5">
                        <form onSubmit={handleSubmit(onSubmitHandler)}>

                            <div className="row">
                                <div className="col-sm">
                                <div className="mb-3">
                                    <label htmlFor="txtBranchName" className="form-label"> Branch Name</label>
                                    <input {...register("txtBranchName")} type="text" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtBranchName?.message}</p>
                                </div>
                                </div>
                            

                                <div className="col-sm">
                                    <div className="mb-3">
                                        <label htmlFor="txtAddress" className="form-label">Address</label>
                                        <textarea {...register("txtAddress")}  type="textarea" height={20} className="form-control"  onChange={onChange} />
                                        <p>{errors.txtAddress?.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm">
                                <div className="mb-3">
                                    <label htmlFor="txtCity" className="form-label"> City</label>
                                    <input {...register("txtCity")} type="text" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtCity?.message}</p>
                                </div>
                                </div>
                            

                                <div className="col-sm">
                                    <div className="mb-3">
                                        <label htmlFor="cmbProvinceStateId" className="form-label">Province State</label>
                                        <select {...register("cmbProvinceStateId")}  className="form-control"  onChange={onChange}> 
                                            <option value="0">- Select -</option>
                                            {  //Combo Data binding
                                                        
                                                        resbody.map((res) => 
                                                        (<option key={res.k} value={res.v}>{res.v}</option>))
                                            }
                                        </select>
                                        <p>{errors.cmbProvinceStateId?.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtPhoneNo" className="form-label"> Phone no</label>
                                    <input {...register("txtPhoneNo")} type="text" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtPhoneNo?.message}</p>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtAltPhoneNo" className="form-label">Alt Phone no</label>
                                    <input {...register("txtAltPhoneNo")} type="text" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtAltPhoneNo?.message}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtEmail" className="form-label"> EMail</label>
                                    <input {...register("txtEmail")} type="email" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtEmail?.message}</p>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtAltEmail" className="form-label">Alt Email</label>
                                    <input {...register("txtAltEmail")} type="email" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtAltEmail?.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtRegNumber" className="form-label"> Reg Number</label>
                                    <input {...register("txtRegNumber")} type="text" className="form-control"  onChange={onChange}/>
                                    <p>{errors.txtRegNumber?.message}</p>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtRegOn" className="form-label">Registered On</label>
                                    <input {...register("txtRegOn")} type="date" className="form-control"  onChange={onChange} placeholder="YYYY-MM-DD"/>
                                    <p>{errors.txtRegOn?.message}</p>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtBookStartedOn" className="form-label"> Book Started Onr</label>
                                    <input {...register("txtBookStartedOn")} type="date" className="form-control"  onChange={onChange} placeholder="YYYY-MM-DD"/>
                                    <p>{errors.txtBookStartedOn?.message}</p>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="txtFYStartsOn" className="form-label">FY Starts On</label>
                                    <input {...register("txtFYStartsOn")} type="date" className="form-control"  onChange={onChange} placeholder="YYYY-MM-DD"/>
                                    <p>{errors.txtFYStartsOn?.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm">
                                    <div className="mb-3">
                                    <label htmlFor="cmbBaseCurrid" className="form-label"> Book Started Onr</label>
                                    <select {...register("cmbBaseCurrid")} className="form-control"  onChange={onChange} >
                                        <option value="0">- Select -</option>
                                        <option value="1">INR</option>
                                        <option value="2">ZMW</option>
                                        <option value="3">USD</option>
                                        <option value="4">EUR</option>
                                    </select>
                                    <p>{errors.cmbBaseCurrid?.message}</p>
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <div className="mb-3">
                                    
                                    </div>
                                </div>
                            </div>



                            <button type="submit" className="btn btn-primary">
                             Submit
                            </button>

                    </form>                          


                       


                    </div>
                    </div>
                 </div>
            </div>
        </div>
   
    </section>
    </>
  );
};

export default CreateBranch;