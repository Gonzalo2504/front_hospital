import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getEnfermeros,
  deleteEnfermero,
  updateEnfermero,
  createEnfermero,
} from "../../api/endpoints/enfermeros";
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

const EnfermeroTable = ({ drawerOpen }) => {
  const [enfermeros, setEnfermeros] = useState([]);
  const [editingEnfermeros, setEditingEnfermeros] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    usuario: "",
    contrasena: "",
    rol_id: 3,
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchEnfermeros();
  }, []);

  const fetchEnfermeros = async () => {
    try {
      const response = await getEnfermeros();
      setEnfermeros(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching enfermeros:", error);
    }
  };

  const addEnfermero = async () => {
    try {
      const response = await createEnfermero(formData);
      await fetchEnfermeros(); // Llama a fetchEnfermeros para actualizar la tabla
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        usuario: "",
        contrasena: "",
        rol_id: 3,
      });
    } catch (error) {
      console.error("Error adding enfermero:", error);
    }
    closeModal();
  };

  const updateEnfermeroDetails = async (id) => {
    try {
      await updateEnfermero(id, formData);
      fetchEnfermeros(); // Llama a fetchEnfermeros para actualizar la tabla
      setEditingEnfermeros(null);
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        email: "",
        telefono: "",
        usuario: "",
        contrasena: "",
        rol_id: 3,
      });
    } catch (error) {
      console.error("Error updating enfermero:", error);
    }
    closeModal();
  };

  const deleteEnfermero = async (id) => {
    const enfermero = enfermeros.find((e) => e.id === id);
    const confirmDelete = window.confirm(
      `Desea borrar al enfermero ${enfermero.nombre} ${enfermero.apellido} DNI ${enfermero.dni}?`
    );
    if (confirmDelete) {
      try {
        await deleteEnfermero(id);
        setEnfermeros(enfermeros.filter((e) => e.id !== id));
      } catch (error) {
        console.error("Error deleting enfermero:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEnfermeros) {
      updateEnfermeroDetails(editingEnfermeros.id);
    } else {
      addEnfermero();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (enfermero) => {
    setEditingEnfermeros(enfermero);
    setFormData(enfermero);
    setIsCreating(false);
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCreateEnfermero = () => {
    setEditingEnfermeros(null);
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      telefono: "",
      usuario: "",
      contrasena: "",
      rol_id: 3,
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
        onClick={handleCreateEnfermero}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Crear Enfermero
      </button>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px",
          color: "#333",
        }}
      >
        Enfermeros
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
            {enfermeros.length > 0 &&
              Object.keys(enfermeros[0] || {}).map((key) => (
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
          {enfermeros.length > 0 &&
            enfermeros
              .slice(currentPage * 10, (currentPage + 1) * 10)
              .map((enfermero) => (
                <tr
                  key={enfermero.id}
                  style={{
                    backgroundColor: enfermero.id % 2 === 0 ? "#f2f2f2" : "white",
                  }}
                >
                  {Object.values(enfermero || {}).map((value, index) => (
                    <td
                      key={index}
                      style={{ padding: "10px", border: "1px solid #ddd" }}
                    >
                      {value}
                    </td>
                  ))}
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      onClick={() => handleEdit(enfermero)}
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
                      onClick={() => deleteEnfermero(enfermero.id)}
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
        contentLabel={isCreating ? "Crear Enfermero" : "Editar Enfermero"}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "24px",
            color: "#333",
          }}
        >
          {isCreating ? "Crear Enfermero" : "Editar Enfermero"}
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

export default EnfermeroTable;
