import React, { useState, useEffect } from "react";
import { getPacientesEnEspera } from "../../../api/endpoints/enfermero/estadoPacientes";
import { createTriage } from "../../../api/endpoints/enfermero/relizarTriages";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";

const PacienteEnEsperaTable = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [idEnfermero, setIdEnfermero] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesEnEspera();
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
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

  const realizarTriage = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const triageData = {
      id_paciente: formData.get("paciente_id") || null,
      id_enfermero: idEnfermero,
      fecha_y_hora: formData.get("fecha_y_hora") || null,
      clasificacion: formData.get("clasificacion") || null,
      antecedentes: formData.get("antecedentes") || null,
      frecuencia_cardiaca: formData.get("frecuencia_cardiaca") || null,
      presion_arterial_sistolica:
        formData.get("presion_arterial_sistolica") || null,
      presion_arterial_diastolica:
        formData.get("presion_arterial_diastolica") || null,
      temperatura: formData.get("temperatura") || null,
      frecuencia_respiratoria: formData.get("frecuencia_respiratoria") || null,
      saturacion_oxigeno: formData.get("saturacion_oxigeno") || null,
      motivo_consulta: formData.get("motivo_consulta") || null,
      observaciones: formData.get("observaciones") || null,
    };

    try {
      const response = await createTriage(triageData);
      console.log(response);
      fetchPatients();
    } catch (error) {
      console.error("Error creando triage:", error);
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
              ID
            </th>
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
              Hora de Ingreso
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
                  {patient.id}
                </td>
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
                  {patient.fecha_estado_cambio}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setModalIsOpen(true);
                    }}
                    style={{
                      backgroundColor: "#4c2882",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Hacer Triage
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "700px",
            height: "800px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >

        <form
          onSubmit={realizarTriage}
          style={{ maxHeight: "100%", overflow: "auto" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {/* Fecha y Hora */}
            <div style={{ flex: "1 1 calc(50% - 10px)" }}>
              <label>
                Fecha y Hora:
                <input
                  type="datetime-local"
                  name="fecha_y_hora"
                  value={new Date().toISOString().slice(0, 16)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </label>
            </div>

            {/* Clasificación */}
            <div style={{ flex: "1 1 calc(50% - 10px)" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Clasificación:
              </label>
              <select
                name="clasificacion"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                required
              >
                <option value="Verde">Verde</option>
                <option value="Amarillo">Amarillo</option>
                <option value="Rojo">Rojo</option>
              </select>
            </div>

            {/* Antecedentes */}
            <div style={{ flex: "1 1 calc(50% - 10px)" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Antecedentes:
              </label>
              <textarea
                name="antecedentes"
                placeholder="Ej: Diabetes tipo 2, Hipertensión"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Motivo de Consulta */}
            <div style={{ flex: "1 1 calc(50% - 10px)" }}>
              <label style={{ display: "block", marginBottom: "10px" }}>
                Motivo de Consulta:
              </label>
              <textarea
                name="motivo_consulta"
                placeholder="Ej: Fiebre alta y dificultad para respirar"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px",
                  marginTop: "10px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Campos Numéricos */}
            {[
              {
                name: "frecuencia_cardiaca",
                label: "Frecuencia Cardíaca",
                placeholder: "Ej: 75",
              },
              {
                name: "presion_arterial_sistolica",
                label: "Presión Arterial Sistólica",
                placeholder: "Ej: 120",
              },
              {
                name: "presion_arterial_diastolica",
                label: "Presión Arterial Diastólica",
                placeholder: "Ej: 80",
              },
              {
                name: "temperatura",
                label: "Temperatura",
                placeholder: "Ej: 38.5",
                step: "0.1",
              },
              {
                name: "frecuencia_respiratoria",
                label: "Frecuencia Respiratoria",
                placeholder: "Ej: 18",
              },
              {
                name: "saturacion_oxigeno",
                label: "Saturación de Oxígeno",
                placeholder: "Ej: 97",
              },
            ].map((field) => (
              <div style={{ flex: "1 1 calc(50% - 10px)" }} key={field.name}>
                <label>
                  {field.label}:
                  <input
                    type="number"
                    name={field.name}
                    placeholder={field.placeholder}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px",
                      marginTop: "10px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                    {...(field.step ? { step: field.step } : {})}
                    min="0"
                  />
                </label>
              </div>
            ))}

            {/* Observaciones */}
            <div style={{ flex: "1 1 100%" }}>
              <label>
                Observaciones:
                <textarea
                  name="observaciones"
                  placeholder="Ej: Paciente refiere dolor intenso en el pecho"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "12px",
                    marginTop: "10px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </label>
            </div>

          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "15px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
              fontSize: "16px",
            }}
          >
            Crear Triage
          </button>
          </div>
        </form>
      </Modal>

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

export default PacienteEnEsperaTable;
