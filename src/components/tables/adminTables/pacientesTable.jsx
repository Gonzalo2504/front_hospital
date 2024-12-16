import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getPacientes,
  deletePaciente,
  updatePaciente,
  createPaciente,
} from "../../../api/endpoints/administrativo/pacientes";
import ReactPaginate from "react-paginate";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    borderRadius: "8px",
    padding: "20px",
  },
};

Modal.setAppElement("#root");

const PacienteTable = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nacimiento: "",
    direccion: "",
    telefono: "",
    email: "",
    estado_atencion: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientes();
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const addPatient = async () => {
    try {
      const response = await createPaciente(formData);
      await fetchPatients(); // Llama a fetchPatients para actualizar la tabla
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        fecha_nacimiento: "",
        direccion: "",
        telefono: "",
        email: "",
        estado_atencion: "",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
    }
    closeModal();
  };

  const updatePatient = async (id) => {
    try {
      await updatePaciente(id, formData);
      fetchPatients(); 
      setEditingPatient(null);
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        fecha_nacimiento: "",
        direccion: "",
        telefono: "",
        email: "",
        estado_atencion: "",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
    }
    closeModal();
  };

  const deletePatient = async (id) => {
    const patient = patients.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `Desea borrar al paciente ${patient.nombre} ${patient.apellido} DNI ${patient.dni}?`
    );
    if (confirmDelete) {
      try {
        await deletePaciente(id);
        setPatients(patients.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient.id);
    } else {
      addPatient();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setIsCreating(false);
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      fecha_nacimiento: "",
      direccion: "",
      telefono: "",
      email: "",
      estado_atencion: "",
    });
    setIsCreating(true);
    openModal();
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
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
      <button
        onClick={handleCreatePatient}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Crear Paciente
      </button>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Pacientes
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            {patients.length > 0 &&
              Object.keys(patients[0] || {}).map((key) => (
                <th
                  key={key}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </th>
              ))}
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
          {patients.length > 0 &&
            patients
              .slice(currentPage * 10, (currentPage + 1) * 10)
              .map((patient) => (
                <tr
                  key={patient.id}
                  style={{
                    backgroundColor: patient.id % 2 === 0 ? "#f2f2f2" : "white",
                  }}
                >
                  {Object.values(patient || {}).map((value, index) => (
                    <td
                      key={index}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {value}
                    </td>
                  ))}
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleEdit(patient)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Eliminar
                    </button>
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={isCreating ? "Crear Paciente" : "Editar Paciente"}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
            color: "#333",
          }}
        >
          {isCreating ? "Crear Paciente" : "Editar Paciente"}
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {Object.keys(formData || {}).map((key) => (
            <div key={key} style={{ marginBottom: "15px", width: "100%" }}>
              {key === "fecha_nacimiento" ? (
                <input
                  type="date"
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              ) : key === "estado_atencion" ? (
                <select
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="En espera">En espera</option>
                  <option value="Atendido">Atendido</option>
                  <option value="En tratamiento">En tratamiento</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  required={key !== "telefono"}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {isCreating ? "Agregar" : "Actualizar"}
          </button>
        </form>
        <button
          onClick={closeModal}
          style={{
            marginTop: "20px",
            backgroundColor: "#ccc",
            color: "#333",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default PacienteTable;
