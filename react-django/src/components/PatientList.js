import { useEffect, useState } from "react";
import { deletepatient, getpatient } from "../services/ApiService";
import AddPatient from "./AddPatient"

const PatientList = () => {
    const [patients, setPatients] = useState([])
    const [showAddPatient, setShowAddPatient] = useState(false)
    const [editPatient, setEditPatient] = useState(null);

    useEffect(() => {
        let mount = true
        getpatient()
            .then( res => {
                console.log("Response from api ", res)
                setPatients(res)
                return() => mount = false
            })
    }, []);

    const handleDeleteBtn = (id) => {
        deletepatient(id)
            .then(() => setPatients(patients.filter(p => p.patient_id != id)))
    }
    const handleCancelBtn = () => {
        setShowAddPatient(false);
        getpatient()
            .then(res => {
                console.log("Response from api ", res)
                setPatients(res)
            })
    }

    const refreshPatients = () => {
      getpatient().then(res => {
        setPatients(res);
      });
    };
    return(
        <div className="container">
            <h3>PatientList</h3>
            <table className="table table-striped table-hover table-bordered">
                <thead className="table-dark">
                <tr>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Blood Group</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {patients.map(patient =>
                    <tr key={patient.patient_id}>
                        <td>{patient.first_name}</td>
                        <td>{patient.last_name}</td>
                        <td>{patient.blood}</td>
                        <td>
                            <button className="btn btn-primary m-2" onClick={() => { setEditPatient(patient); setShowAddPatient(true);
                            }}>Edit
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDeleteBtn(patient.patient_id)}>Delete
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <br/>
            <button className="btn btn-success" onClick={() => setShowAddPatient(!showAddPatient)}>Add New Patient</button>
            <br/>
            <br/>
            {showAddPatient && <AddPatient
                                  handleCancelbtn={() => {
                                    setEditPatient(null);
                                    setShowAddPatient(false);
                                  }}
                                  existingPatient={editPatient}
                                  onPatientSaved={refreshPatients}
                                />}
        </div>
    )
}
export default PatientList