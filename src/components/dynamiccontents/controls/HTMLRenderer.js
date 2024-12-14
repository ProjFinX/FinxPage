import React, { useContext, useState, useEffect } from 'react';
import { FormContext } from "../Contexts/FormContext";
import parse, { domToReact } from 'html-react-parser';
import BarCharts from './Charts/BarCharts';
import PieChart from './Charts/PieChart';

const HTMLRenderer = ({ eid, fieldname, cap, col, mn, ev, val, mxLen, rid, dv }) => {
    const { watch, Fetchdocurl, eDefHldr } = useContext(FormContext);
    const [htmlContent, setHtmlContent] = useState('');
    const [formValues, setFormValues] = useState({});
    const [replacements , setreplacements] = useState({});
    

    const numberFormater = (number) => {
        return number.toLocaleString();
    }

    // Function to unescape HTML content
    const unescapeHTML = (html) => {
        return html
            .replace(/\\t/g, '\t')
            .replace(/\\n/g, '\n')
            .replace(/\\x3C/g, '<')
            .replace(/\\x3E/g, '>')
            .replace(/\\\//g, '/')
            .replace(/\\"/g, '"');
    };

    // Define a mapping from component names to React components
    const componentMap = {
        'charts': PieChart,
    };

    // Function to replace placeholders with dynamic values
    const replacePlaceholders = async (content) => {
        const placeholderRegex = /renderPlaceholders\("([^"]+)"\)/g;

       
        let match;
        

        let replacement_s = {}

        while ((match = placeholderRegex.exec(content)) !== null) {
            const fieldName = match[1];
            if (!replacement_s[fieldName]) {
                replacement_s[fieldName] = await renderPlaceholders(fieldName);
            }
        }

        for (const [fieldName, value] of Object.entries(replacement_s)) {
            content = content.replace(new RegExp(`renderPlaceholders\\("${fieldName}"\\)`, 'g'), `"${value}"`);
        }


        return content;
    };

    // // Function to fetch value for placeholders
    // const renderPlaceholders = async (fieldName) => {
    //     if (eDefHldr.elms[fieldName]?.ty === 9) {
    //         return await processImagePlaceholder(fieldName);
    //     }
    //     const value = formValues[fieldName] || '';
    //     console.log(`Field: ${fieldName}, Value: ${value}`);
    //     return value;
    // };

    const renderPlaceholders = async (fieldName, formater) => {

        
        if (eDefHldr.elms[fieldName]?.ty === 9) {
            return await processImagePlaceholder(fieldName);
        }

        let value = formValues[fieldName];

        if (!value && eDefHldr?.elmsData?.[fieldName]) {
            value = eDefHldr?.elmsData?.[fieldName]; // Fallback to eDefHldr.elmsData if no data from watch
        }

        
        if (value) {
            value = value &&  typeof value === 'object' ? fieldName : value.toString().replace(/\n/g, '');
        }

        if (value && eDefHldr.elms[fieldName]?.ty === 2) {
            value = numberFormater(parseFloat(value));
        }

        return value || '';
    };


    const processImagePlaceholder = async (fieldName) => {
        
        let fieldValue = formValues[fieldName];

        if (!fieldValue && eDefHldr?.elmsData?.[fieldName]) {
            fieldValue = eDefHldr?.elmsData?.[fieldName]; // Fallback to eDefHldr.elmsData if no data from watch
        }

        if (fieldValue && fieldValue !== "" && fieldValue?.[0]?.name != null) {
            return await Fetchdocurl(fieldName);
        }
        return '/FinxPage/custimg.svg';
    };

    // Function to evaluate expressions within the content
    const evaluateExpressions = (content) => {
        const expressionRegex = /\$\{([^}]+)\}/g;
        return content.replace(expressionRegex, (_, expressionText) => {
            try {
                const result = new Function('formValues', `with (formValues) { return ${expressionText}; }`)(formValues);
                return result !== undefined ? result : '';
            } catch (error) {
                console.error(`Error evaluating expression: ${expressionText}`, error);
                return '';
            }
        });
    };
    const htmlToReact = (html) => {
        return  parse(html, {
            replace: (domNode) => {
                if (domNode.type === 'tag' && componentMap[domNode.name]) {
                    const Component = componentMap[domNode.name];
                  
                    // Explicitly ensure that `elmtdata` is passed as a prop
                    const elmtData = eDefHldr?.elmsData?.[domNode.attribs['elmtdata']];
                    return <Component {...domNode.attribs} style={domNode.attribs.style} elmtData={elmtData}>{domToReact(domNode.children)}</Component>;
                }
            }
        });
    };
    


    // useEffect(() => {
    //     const subscription = watch((values) => {
    //         setFormValues(values);
    //     });
    //     return () => subscription.unsubscribe();
    // }, [watch]);

    useEffect(() => {
        const subscription = watch((values) => {
            // Update form values from `watch`
            setFormValues(values);
        });
    

        const processContent = async () => {
            let content = unescapeHTML(dv);
            content = await replacePlaceholders(content); // First replace placeholders
            content = evaluateExpressions(content); // Then evaluate expressions
            setHtmlContent(content);
        };

        processContent();

    
        return () => subscription.unsubscribe();


    }, [watch, eDefHldr]);
    

    // useEffect(() => {
    //     const processContent = async () => {
    //         let content = unescapeHTML(dv);
    //         content = await replacePlaceholders(content); // First replace placeholders
    //         content = evaluateExpressions(content); // Then evaluate expressions
    //         setHtmlContent(content);
    //     };

    //     processContent();
    // }, [dv, formValues, eDefHldr]);

    return (

        <div id={fieldname} key={fieldname} className={`${col} mb-3 ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}>
            {htmlToReact(htmlContent)}
        </div>
    );
};

export default HTMLRenderer;
