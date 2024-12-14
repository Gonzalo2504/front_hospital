import React, { useState, useEffect } from "react";
import {
  getPacientesEnAtencionPorClasificacion,
  getUltimoTriage,
} from "../../../api/endpoints/medico/estadoPacientesMed";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PacienteTriageVerde = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [ultimoTriage, setUltimoTriage] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesEnAtencionPorClasificacion("Verde");
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div
      style={{
        width: drawerOpen ? "calc(87vw - 2px)" : "100vw",
        margin: "0 0 0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Nombre
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Apellido
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              DNI
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Teléfono
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Email
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Fecha de nacimiento
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {patients
            .slice(currentPage * 10, (currentPage + 1) * 10)
            .map((patient) => (
              <tr
                key={patient.id}
                style={{
                  backgroundColor: patient.id % 2 === 0 ? "#f2f2f2" : "white",
                }}
              >
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.nombre}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.apellido}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.dni}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.telefono}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.email}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {patient.fecha_nacimiento}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => {
                      getUltimoTriage(patient.id).then((ultimoTriage) => {
                        setUltimoTriage(ultimoTriage);
                        setIsOpen(true);
                      });
                    }}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Ver Ultimo Triage
                  </button>
                  {isOpen && (
                   <Modal
                   isOpen={isOpen}
                   onRequestClose={() => setIsOpen(false)}
                   style={{
                     overlay: {
                       backgroundColor: "rgba(0, 0, 0, 0.5)",
                     },
                     content: {
                       width: "700px",
                       maxHeight: "90vh",
                       margin: "auto",
                       padding: "20px",
                       borderRadius: "10px",
                       boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                       overflow: "auto",
                     },
                   }}
                 >
                   <h2
                     style={{
                       textAlign: "center",
                       marginBottom: "20px",
                       fontSize: "24px",
                       fontWeight: "bold",
                       color: "#333",
                     }}
                   >
                     Último Triage
                   </h2>
                 
                   <div
                     style={{
                       display: "flex",
                       flexWrap: "wrap",
                       gap: "20px",
                     }}
                   >
                     {ultimoTriage &&
                       Object.entries(ultimoTriage).map(([key, value]) => {
                         // Ocultar IDs del triage, paciente y enfermero
                         if (
                           key === "id_triage" ||
                           key === "id_paciente" ||
                           key === "id_enfermero"
                         )
                           return null;
                 
                         // Convertir claves en etiquetas legibles
                         const label = key
                           .replace(/_/g, " ")
                           .replace(/\b\w/g, (char) => char.toUpperCase());
                 
                         return (
                           <div
                             key={key}
                             style={{
                               flex: "1 1 calc(50% - 10px)",
                               marginBottom: "10px",
                             }}
                           >
                             <label
                               style={{
                                 display: "block",
                                 fontSize: "14px",
                                 fontWeight: "bold",
                                 color: "#555",
                                 marginBottom: "5px",
                               }}
                             >
                               {label}:
                             </label>
                             <div
                               style={{
                                 fontSize: "16px",
                                 color: "#333",
                                 backgroundColor: "#f5f5f5",
                                 padding: "12px",
                                 borderRadius: "5px",
                                 border: "1px solid #ddd",
                               }}
                             >
                               {value}
                             </div>
                           </div>
                         );
                       })}
                   </div>
                 
                   <div style={{ textAlign: "center", marginTop: "20px" }}>
                     <button
                       onClick={() => setIsOpen(false)}
                       style={{
                         backgroundColor: "#007bff",
                         color: "#fff",
                         border: "none",
                         borderRadius: "5px",
                         padding: "12px 20px",
                         fontSize: "16px",
                         cursor: "pointer",
                       }}
                     >
                       Cerrar
                     </button>
                   </div>
                 </Modal>
                 
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakLinkClassName={"page-link"}
          renderOnZeroPageCount={null}
        />
      </div>
      <style>
        {`
          .pagination {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 0;
            align-items: center;
          }
          .page-item {
            margin: 0 5px;
          }
          .page-link {
            padding: 10px 15px;
            border: 1px solid #007bff;
            border-radius: 4px;
            color: #007bff;
            text-decoration: none;
            cursor: pointer;
          }
          .page-link:hover {
            background-color: #007bff;
            color: white;
          }
          .active .page-link {
            background-color: #007bff;
            color: white;
            border-color: #007bff;
          }
        `}
      </style>
    </div>
  );
};

export default PacienteTriageVerde;
