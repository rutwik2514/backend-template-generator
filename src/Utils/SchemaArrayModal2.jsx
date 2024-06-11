import React, { useState } from 'react'
import SchemaArrayModal from './SchemaArrayModal';

function SchemaArrayModal2({showArrayModal,setShowArrayModal,parentIndex,field,setField}) {
    // const [showArrayModal,setShowArrayModal]=useState(true);
    const [arrayFields, setArrayFields] = useState([]);
    const [newArrayModal,setNewArrayModal]=useState(false)
    const [newIndex,setNewIndex]=useState();
    // const [showArrayModal2,setShowArrayModal2]=useState(false);
    const addArrayField = () => {
        setArrayFields([...arrayFields, { name: '', required: false, unique: false, type: '' }]);
    };
    const handleArrayFieldSubmit = () =>{
        console.log("fields are", arrayFields);
        const updatedFields = [...field];
        updatedFields[parentIndex] = { ...updatedFields[parentIndex],"type": "Array", "content" : arrayFields };
        setField(updatedFields);
        // setField({ ...field, "type": "Array", "content" : arrayFields });
        setShowArrayModal(false);
        
    }
    const handleArrayFieldChange = (index, key, value) => {
        if(key=="type" && value == "Array"){
            console.log("setting");
            // setNewArrayModal(index);
            setNewIndex(index)
            setNewArrayModal(true);
        }
        const newArrayFields = [...arrayFields];
        newArrayFields[index][key] = value;
        setArrayFields(newArrayFields);
    };
  return (
    // <></>
    <div className="modal" tabIndex="-1" style={{ display: showArrayModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content" style={{ minHeight: "50vh" }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Array Fields</h5>
                            <button type="button" className="btn-close" onClick={() => setShowArrayModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {arrayFields.map((arrayField, index) => (
                                <div key={index}>
                                    <div className="mb-3">
                                        <label htmlFor={`fieldName${index}`} className="form-label">Field Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`fieldName${index}`}
                                            value={arrayField.name}
                                            onChange={(e) => handleArrayFieldChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor={`fieldName${index}`} className="form-label">Field Type</label>
                                        <select
                                            className="form-select"
                                            id={`fieldName${index}`}
                                            value={arrayField.type}
                
                                            onChange={(e) => handleArrayFieldChange(index, 'type', e.target.value)}
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

                                </div>
                                
                            ))}
                            {newArrayModal && <SchemaArrayModal showArrayModal={newArrayModal} setShowArrayModal={setNewArrayModal} parentIndex={newIndex} field={arrayFields} setField={setArrayFields} />}
                            <button type="button" className="btn btn-primary" onClick={addArrayField}>Add Field</button>
                        </div>
                        {/* {newArrayModal && <SchemaArrayModal />} */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowArrayModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleArrayFieldSubmit}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
  )
}

export default SchemaArrayModal2