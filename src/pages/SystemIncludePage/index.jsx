import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import api from "../../services/api";

const includeSchema = yup.object().shape({
  descricao: yup
    .string()
    .max(100, "O máximo de caracteres na descrição é 100")
    .required("A descrição é obrigatória")
    .trim(),

  sigla: yup
    .string()
    .max(10, "O máximo de caracteres da sigla é 10")
    .required("A sigla é obrigatória")
    .trim(),

  emailAtendimento: yup
    .string()
    .email("Insira um email de atendimento válido")
    .max(100, "O email de atendimento pode ter no máximo 100 caracteres")
    .trim(),

  url: yup
    .string()
    .url("Insira uma url válida")
    .max(50, "O tamanho da url deve ser no máximo 50 caracteres")
    .trim(),
});

function SystemIncludePage() {
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");
  const [emailAtendimento, setEmailAtendimento] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successInclude, setSuccessInclude] = useState(false);
  const history = useHistory();

  const cleanData = () => {
    setDescricao("");
    setSigla("");
    setEmailAtendimento("");
    setUrl("");
  };

  const includeSystem = async (e) => {
    e.preventDefault();
    setSuccessInclude(false);
    const valid = await includeSchema.isValid({
      descricao,
      sigla,
      emailAtendimento,
      url,
    });

    includeSchema
      .validate(
        {
          descricao,
          sigla,
          emailAtendimento,
          url,
        },
        { abortEarly: false }
      )
      .catch(({ errors }) => setError(errors));

    if (valid) {
      setError(null);
      setIsLoading(true);
      try {
        await api.post("/SSD", {
          descricao,
          sigla,
          emailAtendimento,
          url,
        });
        setSuccessInclude(true);
        cleanData();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { response } = error;

        if (response?.status === 400) {
          return setError(["Algum dado foi informado errado!"]);
        }

        return setError([
          "Verifique sua conexão, se o problema persistir tente novamente mais tarde.",
        ]);
      }
    }
  };

  return (
    <div>
      <Form className="header-form bg-white p-4 rounded mb-5">
        <div className="d-flex justify-content-between ">
          <h5 className="text-dark mb-4">Manter Sistema</h5>
          <span className="text-danger">* Campos Obrigatórios</span>
        </div>
        <Form.Group as={Row} controlId="formHorizontalDescription">
          <Form.Label column sm={6} className="text-dark">
            <span className="text-danger">*</span> Descrição
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
            <span className="text-danger">*</span> Sigla
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
        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            Url
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
          </Col>
        </Form.Group>
        {error && (
          <Alert variant="danger" className="mt-1 mb-0">
            {error.map((e, i) => (
              <p key={i}>-{e}</p>
            ))}
          </Alert>
        )}
        {successInclude && (
          <Alert variant="success" className="mt-1 mb-0">
            <p>Operação realizada com sucesso.</p>
          </Alert>
        )}
      </Form>
      <div className="buttons-container">
        <Button variant="light" onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Voltar
        </Button>

        <Button variant="light" onClick={(e) => includeSystem(e)}>
          Salvar{" "}
          {!isLoading ? (
            <FontAwesomeIcon icon={faSave} />
          ) : (
            <Spinner
              className="ml-2"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </div>
    </div>
  );
}

export default SystemIncludePage;
