import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import SchemaArrayModal from '../../Utils/SchemaArrayModal';

function SchemaCreate() {
    const [showModal, setShowModal] = useState(false);
    const [customType, setCustomType] = useState('');
    const [field, setField] = useState([{ name: '', required: false, unique: false, type: '', content:'' }]);
    const [arrayFields, setArrayFields] = useState([]);
    const [showArrayModal, setShowArrayModal] = useState(false);
    const [error, setError] = useState(false);
    //setting field values
    const handleInputChange = (key, value,index) => {
        const updatedFields = [...field];
        console.log("index changed is", index);
        // Update the object at the specified index with the new key-value pair
        updatedFields[index] = { ...updatedFields[index], [key]: value };
        setField(updatedFields);
    };
    const addField = () =>{
        const newField = { name: '', required: false, unique: false, type: '', content:'' };
        setField([...field, newField]);
    }

    //checking if all brackets are matched
    const bracketsMatch = (str) => {
        const stack = [];
        const openingBrackets = ['(', '[', '{'];
        const closingBrackets = [')', ']', '}'];
        let flag = false;
        str.trim().replace(/\s+/g, '')
        let newStr = ""
        for (let i = 0; i < str.length; i++) {
            if (str[i] >= 'a' && str[i] <= 'z') {
                newStr += str[i];
            }
            else if (str[i] >= 'A' && str[i] <= 'Z') {
                newStr += str[i];
            }
            else if (openingBrackets.includes(str[i]) || closingBrackets.includes(str[i])) {
                newStr += str[i];
            }
        }
        str = newStr;
        console.log("str", str);

        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (openingBrackets.includes(char)) {
                stack.push(char);
            } else if (closingBrackets.includes(char)) {
                const lastOpeningBracket = stack.pop();
                const correspondingOpeningBracket = openingBrackets[closingBrackets.indexOf(char)];
                if (lastOpeningBracket !== correspondingOpeningBracket) {
                    return false;
                }
            }
            if (stack.length === 0 && i !== str.length - 1) return false
        }

        return stack.length === 0;
    };
    //for modal opening
    const handleTypeChange = (event,index) => {
        const value = event.target.value;
        console.log("came to type vchange",value);
        if (value === 'custom') {
            setShowModal(true);
        } else if (value === 'Array') {
            setShowModal(false); // Close current modal
            console.log("opening");
            setShowArrayModal(true); // Open modal for array fields
        } else {
            handleInputChange('type', value,index);
        }
    };
    const handleArrayFieldSubmit = () => {
        // Process array field data
        // For demonstration, we are just logging the array fields
        console.log(arrayFields);
        setShowArrayModal(false);
    };
    const addArrayField = () => {
        setArrayFields([...arrayFields, { name: '', required: false, unique: false, type: '' }]);
    };
    const handleArrayFieldChange = (index, key, value) => {
        const newArrayFields = [...arrayFields];
        newArrayFields[index][key] = value;
        setArrayFields(newArrayFields);
    };

    //after modal saved
    const handleCustomTypeSubmit = (e,index) => {
        handleInputChange('type', customType,index);
        setShowModal(false);
    };
    //getting index where it was changed for adding
    const getChangedIndex = (oldString, newString) => {
        if (newString.length > oldString.length) {
            let index = -1;
            for (let i = 0; i < oldString.length; i++) {
                if (oldString[i] !== newString[i]) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                index = newString.length - 1;
            }
            return index;
        }
    };

    const handleChangeSchemaType = (e) => {
        let oldString = customType;
        let newString = e.target.value;
        setCustomType(newString);

        const textarea = e.target;
        const cursorPosition = textarea.selectionStart;

        const brackets = new Map([
            ['{', '}'],
            ['(', ')'],
            ['[', ']']
        ]);

        let index = getChangedIndex(oldString, newString);

        if (brackets.has(newString[index])) {
            const closingBracket = brackets.get(newString[index]);
            let prefix = newString.slice(0, index + 1);
            let suffix = newString.slice(index + 1);
            const updatedString = prefix + closingBracket + suffix;
            setCustomType(updatedString);
            newString = updatedString;

            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            }, 0);
        }

        setError(bracketsMatch(newString));
    };

    return (
        <>
        {field.map((val,index)=>{console.log("field is",val,index);return(
            <div className="container mt-4" key={index}>
            <div className="mb-3">
                <label htmlFor="schemaName" className="form-label">Schema Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="schemaName"
                    placeholder="Enter schema name"
                    value={val.name}
                    onChange={(e) => handleInputChange('name', e.target.value,index)}
                />
            </div>

            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="required"
                    checked={val.required}
                    onChange={(e) => handleInputChange('required', e.target.checked,index)}
                />
                <label className="form-check-label" htmlFor="required">Required?</label>
            </div>

            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="unique"
                    checked={val.unique}
                    onChange={(e) => handleInputChange('unique', e.target.checked,index)}
                />
                <label className="form-check-label" htmlFor="unique">Unique?</label>
            </div>

            <div className="mb-3">
                <label htmlFor="schemaType" className="form-label">Schema Type</label>
                <select
                    className="form-select"
                    id="schemaType"
                    value={val.type}
                    onChange={(e)=>handleTypeChange(e,index)}
                >
                    <option value="">Select schema type</option>
                    <option value="String">String</option>
                    <option value="Number">Number</option>
                    <option value="Boolean">Boolean</option>
                    <option value="Date">Date</option>
                    <option value="Buffer">Buffer</option>
                    <option value="ObjectID">ObjectID</option>
                    <option value="Array">Array</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Decimal128">Decimal128</option>
                    <option value="Enum">Enums</option>
                    <option value="custom">Not present in list</option>
                </select>
            </div>

            <div className="modal" tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content" style={{ height: "50vh" }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Custom Schema Type</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                style={{ height: "30vh" }}
                                className="form-control"
                                value={customType}
                                onChange={handleChangeSchemaType}
                                placeholder="Enter custom schema type"
                            ></textarea>
                        </div>
                        {!error && <p style={{ color: "red" }}>Syntax Error</p>}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={(e) => handleCustomTypeSubmit(e,index)}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={()=>console.log(field)}>Submit</button>
          {showArrayModal && <SchemaArrayModal showArrayModal={showArrayModal} setShowArrayModal={setShowArrayModal} parentIndex={index} field={field} setField={setField} />}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
        )})}
        <button onClick={addField}>Addfield</button>
        </>
       
    );
}

export default SchemaCreate;
