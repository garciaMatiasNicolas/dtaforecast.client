import { useState } from "react";
import axios from "axios";
import { showErrorAlert } from "../../../other/Alerts";
import {
    MDBBtn,
    MDBIcon,
    MDBInput,
} from 'mdb-react-ui-kit';
import Table from "./TableWithAvg";

const apiUrl = process.env.REACT_APP_API_URL;

const FiltersNested = ({data}) => {
    const [orderedData, setOrderedData] = useState(data);

    // Function for download excel
    const handleDownload = (urlPath) => {
        const link = document.createElement("a");
        link.href = `${apiUrl}/${urlPath}`;
        link.download = `Reapro.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExport = () => {
        const dataToSend = {
            "columns": Object.keys(data[0]),
            "rows": orderedData.map(obj => Object.values(obj)),
            "file_name": `Reapro`,
            "project_pk": parseInt(localStorage.getItem("projectId"))
        };
          
        axios.post(`${apiUrl}/export_excel`, dataToSend, {
            headers: {
                'Authorization': `Token ${localStorage.getItem("userToken")}`, 
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            let file_path = res.data.file_url
            handleDownload(file_path);
        })
        .catch(err => {showErrorAlert(err.response.data); console.log(err)});  
    };

    const handleSearchProduct = (event) => {
        const inputValue = event.target.value.toLowerCase(); 
        const filteredData = data.filter(item => item.SKU.toLowerCase().includes(inputValue));
        setOrderedData(filteredData);
    };

    if (!data || data.length === 0) {
        return <div></div>;
    };
    
    return (
        <div className="w-100 gap-4 d-flex justify-content-start align-items-start flex-column">
            <h5 className='text-primary'>Tabla de stock por producto</h5>

            <MDBBtn 
                className="w-auto" 
                style={{ backgroundColor: '#25d366' }} 
                onClick={handleExport}
                disabled={orderedData.length === 0}
                > Exportar como Excel
                <MDBIcon className="ms-2" fas icon="file-export" />
            </MDBBtn> 

            <div className="w-100 d-flex justify-content-between align-items-center">
                
                <div className="w-auto d-flex justify-content-between align-items-center gap-2">
                    <MDBInput
                        type="text"
                        label="SKU"
                        className="w-auto"
                        onChange={handleSearchProduct}
                    />
                    
                </div>
            
            </div>
            
            <Table data={orderedData} setData={setOrderedData}/>
        </div>
    );
}


export default FiltersNested;