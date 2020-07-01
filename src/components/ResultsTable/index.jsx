import React, { useState } from "react";
import { Table, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

function ResultsTable(props) {
  const [active, setActive] = useState(1);
  const { data, onClickEdit } = props;

  const itemPerPage = 5;
  const indexOfLastItem = active * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItem = data.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / 6); i++) {
    pageNumbers.push(i);
  }

  const pageNumbersCount = pageNumbers.length + 1;

  const nextPage = () => {
    const nextPage = active + 1;
    if (nextPage > pageNumbersCount) return;
    setActive(nextPage);
  };

  const prevPage = () => {
    const prevPage = active - 1;
    if (prevPage > pageNumbersCount) return;
    setActive(prevPage);
  };

  return (
    <>
      <Table striped hover className="bg-white">
        <thead className="thead-dark">
          <tr className="row ">
            <th className="col-3">Descrição</th>
            <th className="col-1">Sigla</th>
            <th className="col-3">E-mail de atendimento</th>
            <th className="col-3">URL</th>
            <th className="col-1">Status</th>
            <th className="col-1">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentItem?.map((item) => {
            return (
              <tr key={item.id} className="row">
                <td className="col-3">{item.descricao}</td>
                <td className="col-1">{item.sigla}</td>
                <td className="col-3">{item.emailAtendimento}</td>
                <td className="col-3">{item.url}</td>
                <td className="col-1">{item.status}</td>
                <td className="col-1" onClick={() => onClickEdit(item.id)}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {pageNumbersCount > 1 && (
        <Pagination>
          <Pagination.First onClick={() => setActive(1)} />
          <Pagination.Prev onClick={() => prevPage()} />
          {pageNumbers?.map((page) => (
            <Pagination.Item
              key={page}
              active={active === page}
              onClick={() => setActive(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => nextPage()} />
          <Pagination.Last onClick={() => setActive(pageNumbersCount)} />
        </Pagination>
      )}
    </>
  );
}

export default ResultsTable;
