import React, { useState } from "react";
import "./style.css";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { logout } from "../../services/auth/";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBroom,
  faPlus,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api";
import ResultsTable from "../../components/ResultsTable";

function DashboardPage() {
  const [data, setData] = useState([]);
  const [alreadyFiltered, setAlreadyFiltered] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");
  const [emailAtendimento, setEmailAtendimento] = useState("");
  const history = useHistory();

  const getSSD = async () => {
    try {
      const res = await api.get("/SSD", {
        params: {
          descricao,
          sigla,
          emailAtendimento,
        },
      });
      res.data && setData(res.data);
      setAlreadyFiltered(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/login");
  };
  const clearData = () => {
    setDescricao("");
    setSigla("");
    setEmailAtendimento("");
    setData([]);
    setAlreadyFiltered(false);
  };

  const onClickEditItem = (id) => {
    history.push(`/dashboard/edit/${id}`);
  };
  return (
    <div>
      <Form className="header-form bg-white p-3 rounded mb-3 ">
        <h5 className="text-dark mb-4">Filtro de Consulta</h5>
        <Form.Group as={Row} controlId="formHorizontalDescription">
          <Form.Label column sm={6} className="text-dark">
            Descrição
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              onChange={(e) => setDescricao(e.target.value)}
              value={descricao}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            Sigla
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              onChange={(e) => setSigla(e.target.value)}
              value={sigla}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            E-mail de atendimento do sistema
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              onChange={(e) => setEmailAtendimento(e.target.value)}
              value={emailAtendimento}
            />
          </Col>
        </Form.Group>
      </Form>
      {data.length === 0 && alreadyFiltered && (
        <Alert variant="warning" className="mt-1">
          Nenhum Sistema foi encontrado. Favor revisar os critérios da sua
          pesquisa!
        </Alert>
      )}

      {data.length > 0 && (
        <ResultsTable data={data} onClickEdit={onClickEditItem} />
      )}

      <div className="buttons-container">
        <Button variant="light" onClick={() => handleLogout()}>
          <FontAwesomeIcon icon={faDoorOpen} /> Deslogar
        </Button>
        <div>
          <Button
            variant="light"
            onClick={() => getSSD(descricao, sigla, emailAtendimento)}
          >
            Pesquisar <FontAwesomeIcon icon={faSearch} />
          </Button>
          <Button
            className="mr-3 ml-3"
            variant="light"
            onClick={() => clearData()}
          >
            Limpar <FontAwesomeIcon icon={faBroom} />
          </Button>
          <Button
            variant="light"
            onClick={() => history.push("/dashboard/system-include")}
          >
            Novo Sistema <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
