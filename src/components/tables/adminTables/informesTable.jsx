import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getInforme, getPacientesConInformeFinal } from "../../../api/endpoints/administrativo/informe";
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

const Informe = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await getPacientesConInformeFinal();
      setPatients(response);
      setPageCount(Math.ceil(response.length / 10));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
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
                      onClick={() => getInforme(patient.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Generar informe
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
    </div>
  );
};

export default Informe;
