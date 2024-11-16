import React, { useState, useEffect } from "react";
import {
  getPacientesEnEspera,
} from "../../../api/endpoints/enfermero/estadoPacientes";
import ReactPaginate from "react-paginate";

const PacienteEnEsperaTable = ({ drawerOpen }) => {
  const [patients, setPatients] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Apellido
            </th>
            <th scope="col" className="px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              DNI
            </th>
            <th scope="col" className="px-6 py-3">
              Tel fono
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Fecha de nacimiento
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.slice(currentPage * 10, (currentPage + 1) * 10).map((patient) => (
            <tr
              key={patient.id}
              className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
            >
              <td className="px-6 py-4">
                {patient.apellido}
              </td>
              <td className="px-6 py-4">
                {patient.nombre}
              </td>
              <td className="px-6 py-4">
                {patient.dni}
              </td>
              <td className="px-6 py-4">
                {patient.telefono}
              </td>
              <td className="px-6 py-4">
                {patient.email}
              </td>
              <td className="px-6 py-4">
                {patient.fecha_nacimiento}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< "
        renderOnZeroPageCount={null}
        className="flex items-center justify-center mt-4"
      />
    </div>
  );

}

export default PacienteEnEsperaTable;
