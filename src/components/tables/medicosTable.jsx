import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getMedicos,
  deleteMedico,
  updateMedico,
  createMedico,
} from "../../api/endpoints/medicos";
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

const MedicoTable = ({ drawerOpen }) => {
  const [medics, setMedics] = useState([]);
  const [editingMedics, setEditingMedics] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    especialidad: "",
    email: "",
    telefono: "",
    usuario: "",
    contrasena: "",
    rol_id: 2,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchMedics();
  }, []);

  const fetchMedics = async () => {
    try {
      const response = await getMedicos();
      setMedics(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching medics:", error);
    }
  };

  const addMedic = async () => {
    try {
      const response = await createMedico(formData);
      await fetchMedics(); // Llama a fetchMedics para actualizar la tabla
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        especialidad: "",
        email: "",
        telefono: "",
        usuario: "",
        contrasena: "",
        rol_id: 2,
      });
    } catch (error) {
      console.error("Error adding medic:", error);
    }
    closeModal();
  };

  const updateMedicoDetails = async (id) => {
    try {
      await updateMedico(id, formData);
      fetchMedics(); // Llama a fetchMedics para actualizar la tabla
      setEditingMedics(null);
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        especialidad: "",
        email: "",
        telefono: "",
        usuario: "",
        contrasena: "",
        rol_id: 2,
      });
    } catch (error) {
      console.error("Error updating medic:", error);
    }
    closeModal();
  };

  const deleteMedicoDetails = async (id) => {
    const medico = medics.find((m) => m.id === id);
    const confirmDelete = window.confirm(
      `Desea borrar al médico ${medico.nombre} ${medico.apellido} DNI ${medico.dni}?`
    );
    if (confirmDelete) {
      try {
        await deleteMedico(id);
        setMedics(medics.filter((m) => m.id !== id));
      } catch (error) {
        console.error("Error deleting medico:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMedics) {
      updateMedicoDetails(editingMedics.id);
    } else {
      addMedic();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (medic) => {
    setEditingMedics(medic);
    setFormData(medic);
    setIsCreating(false);
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCreateMedic = () => {
    setEditingMedics(null);
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      especialidad: "",
      email: "",
      telefono: "",
      usuario: "",
      contrasena: "",
      rol_id: 2,
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
        onClick={handleCreateMedic}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Crear Médico
      </button>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Médicos
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
            {medics.length > 0 &&
              Object.keys(medics[0] || {}).map((key) => (
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
          {medics.length > 0 &&
            medics
              .slice(currentPage * 10, (currentPage + 1) * 10)
              .map((medico) => (
                <tr
                  key={medico.id}
                  style={{
                    backgroundColor: medico.id % 2 === 0 ? "#f2f2f2" : "white",
                  }}
                >
                  {Object.values(medico || {}).map((value, index) => (
                    <td
                      key={index}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {value}
                    </td>
                  ))}
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleEdit(medico)}
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
                      onClick={() => deleteMedic(medico.id)}
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
        contentLabel={isCreating ? "Crear Médico" : "Editar Médico"}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
            color: "#333",
          }}
        >
          {isCreating ? "Crear Médico" : "Editar Médico"}
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
          {Object.keys(formData || {})
            .filter((key) => key !== "fecha_nacimiento")
            .map((key) => (
              <div key={key} style={{ marginBottom: "15px", width: "100%" }}>
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

export default MedicoTable;

