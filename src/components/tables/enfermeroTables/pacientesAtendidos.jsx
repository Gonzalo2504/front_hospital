import React, { useState, useEffect } from "react";
import { getPacientesConOrdenMedicaCreada } from "../../../api/endpoints/enfermero/estadoPacientes";
import {
  getUltimaOrdenMedicaPorPaciente,
  createEvolucionPaciente,
} from "../../../api/endpoints/enfermero/ordenesMedicasEnf";
import ReactPaginate from "react-paginate";

const PacienteAtendidoTable = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalEvol, setShowModalEvol] = useState(false);
  const [evolutionData, setEvolutionData] = useState({
    id_orden_medica: "",
    id_paciente: "",
    id_enfermero: "",
    descripcion: "",
    fecha_y_hora: "",
  });
  const [idEnfermero, setIdEnfermero] = useState(null);
  const [previousSelectedOrder, setPreviousSelectedOrder] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesConOrdenMedicaCreada();
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleViewOrder = async (patientId) => {
    try {
      const order = await getUltimaOrdenMedicaPorPaciente(patientId);
      setSelectedOrder(order);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parts = token.split(".");
      const payload = parts[1];
      const decodedPayload = atob(payload);
      const decodedToken = JSON.parse(decodedPayload);
      setIdEnfermero(decodedToken.id_usuario);
    }
  }, []);

  useEffect(() => {
    if (idEnfermero) {
      console.log(`Hola soy el enfermero con el id: ${idEnfermero}`);
    }
  }, [idEnfermero]);

  const handleCloseModal = () => {
    setShowModal(false);
    setPreviousSelectedOrder(selectedOrder);
    setSelectedOrder(null);
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const handleOpenModalEvol = (patient) => {
    setSelectedPatient(patient);
    setEvolutionData((prev) => ({
      ...prev,
      id_paciente: patient.id,
      id_orden_medica: previousSelectedOrder.id,
      id_enfermero: idEnfermero,
    }));
    setShowModal(true);
  };

  const handleCloseModalEvol = () => {
    setShowModalEvol(false);
    setSelectedPatient(null);
    setEvolutionData({
      id_orden_medica: "",
      id_paciente: "",
      id_enfermero: "",
      descripcion: "",
      fecha_y_hora: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvolutionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fechaYHoraActual = new Date().toISOString().slice(0, 16);
    const evolutionDataConFecha = { ...evolutionData, fecha_y_hora: fechaYHoraActual };
    try {
      await createEvolucionPaciente(evolutionDataConFecha);
      alert("Evolución creada exitosamente");
      handleCloseModalEvol();
      fetchPatients(); // Fetch patients after successful creation
    } catch (error) {
      console.error("Error creating evolution:", error);
      alert("Error al crear la evolución");
    }
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
              }}
            >
              Nombre
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
              }}
            >
              Apellido
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
              }}
            >
              DNI
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
              }}
            >
              Teléfono
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
              }}
            >
              Email
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
              }}
            >
              Fecha de nacimiento
            </th>
            <th
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      onClick={() => handleViewOrder(patient.id)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        flex: 1,
                        marginRight: "5px",
                      }}
                    >
                      Ver Orden Medica
                    </button>
                    <button
                      onClick={() => {
                        handleOpenModalEvol(patient);
                        setShowModalEvol(true);
                      }}
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        flex: 1,
                        marginLeft: "5px",
                      }}
                    >
                      Dar evolucion del Paciente
                    </button>
                  </div>
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

      {showModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>Orden Médica</h3>
          <p>
            <strong>Fecha y Hora:</strong> {selectedOrder.fecha_y_hora}
          </p>
          <p>
            <strong>Descripción:</strong> {selectedOrder.descripcion}
          </p>
          <p>
            <strong>Observaciones:</strong> {selectedOrder.observaciones}
          </p>
          <button
            onClick={handleCloseModal}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={handleCloseModal}
        />
      )}
      {showModalEvol && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <h3>Crear Evolución</h3>
          <form onSubmit={handleSubmit}>
            <label>ID Orden Médica:</label>
            <input
              type="text"
              name="id_orden_medica"
              value={evolutionData.id_orden_medica}
              onChange={handleInputChange}
            />
            <br />
            <label>ID Paciente:</label>
            <input
              type="text"
              name="id_paciente"
              value={evolutionData.id_paciente}
              onChange={handleInputChange}
            />
            <br />
            <label>ID Enfermero:</label>
            <input
              type="text"
              name="id_enfermero"
              value={evolutionData.id_enfermero}
              onChange={handleInputChange}
            />
            <br />
            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={evolutionData.descripcion}
              onChange={handleInputChange}
            />
            <button type="submit">Guardar</button>
            <button onClick={handleCloseModalEvol}>Cerrar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PacienteAtendidoTable;
