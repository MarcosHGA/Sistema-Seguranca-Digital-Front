import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import api from "../../services/api";
import "./style.css";

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

  status: yup
    .string()
    .required("O status é obrigatório")
    .oneOf(["ATIVO", "CANCELADO"], "O Status deve ser ATIVO ou CANCELADO")
    .trim(),

  novaJustificativaAlteracao: yup
    .string()
    .max(
      500,
      "O tamanho da nova justificativa deve ser de no máximo 500 caracteres"
    )
    .required("A nova Justificativa é obrigatória")
    .trim(),
});

function EditSystemPage(props) {
  const [descricao, setDescricao] = useState("");
  const [sigla, setSigla] = useState("");
  const [emailAtendimento, setEmailAtendimento] = useState("");
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [novaJustificativaAlteracao, setNovaJustificativaAlteracao] = useState(
    ""
  );
  const [status, setStatus] = useState("ATIVO");
  const [error, setError] = useState(null);
  const [successEdit, setSuccessEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const {
    match: {
      params: { id },
    },
  } = props;

  useEffect(() => {
    const getOneSSD = async () => {
      try {
        const res = await api.get(`/SSD/${id}`);
        res.data && setData(res.data);

        setDescricao(res.data.descricao);
        setSigla(res.data.sigla);
        setEmailAtendimento(res.data.emailAtendimento);
        setUrl(res.data.url);
        setStatus(res.data.status || "ATIVO");
      } catch (error) {
        console.log(error);
      }
    };
    getOneSSD();
  }, []);

  const editSystem = async (e) => {
    e.preventDefault();
    setSuccessEdit(false);
    const valid = await includeSchema.isValid({
      descricao,
      sigla,
      emailAtendimento,
      url,
      novaJustificativaAlteracao,
      status,
    });

    includeSchema
      .validate(
        {
          descricao,
          sigla,
          emailAtendimento,
          url,
          novaJustificativaAlteracao,
          status,
        },
        { abortEarly: false }
      )
      .catch(({ errors }) => setError(errors));

    if (valid) {
      setError(null);
      setIsLoading(true);
      try {
        const res = await api.put(`/SSD/${id}`, {
          id: +id,
          descricao,
          sigla,
          emailAtendimento,
          url,
          novaJustificativaAlteracao,
          status,
        });
        setSuccessEdit(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        const { response } = error;

        if (response?.status === 400) {
          return setError(["Algum dado foi informado errado!"]);
        }

        if (response?.status === 500) {
          return setError(["Erro no servidor, tente mais tarde"]);
        }

        return setError([
          "Verifique sua conexão, se o problema persistir tente novamente mais tarde.",
        ]);
      }
    }
  };

  return (
    <div>
      <Form className="header-form bg-white p-3 rounded mb-3 mt-3">
        <div className="d-flex justify-content-between ">
          <h5 className="text-dark">Dados do Sistema</h5>
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
              maxLength="100"
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
              maxLength="10"
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
              maxLength="100"
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
              maxLength="50"
            />
          </Col>
        </Form.Group>
      </Form>

      <Form className="header-form system-control bg-white p-3 rounded mb-3">
        <h5 className="text-dark mb-4">Controle do Sistema</h5>

        <Form.Group as={Row} controlId="formHorizontalDescription">
          <Form.Label column sm={6} className="text-dark">
            <span className="text-danger">*</span> Status
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ATIVO">ATIVO</option>
              <option value="CANCELADO">CANCELADO</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            <span className="text-danger"></span> Usuário responsável pela
            última alteração
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              value={data?.usuarioUltimaAlteração}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            Data da última alteração
          </Form.Label>
          <Col sm={6}>
            <Form.Control value={data?.dataUltimaAlteracao} disabled={true} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            Justificativa da ultima alteração
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              as="textarea"
              rows="3"
              value={data?.justificativaUltimaAlteracao}
              disabled={true}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalInitials">
          <Form.Label column sm={6} className="text-dark">
            <span className="text-danger">*</span> Nova justificativa de
            alteração
            <br />
            <br />
            <span className="text-success">
              Quantidade de caracteres disponíveis:{" "}
              <span className="font-weight-bold">
                {500 - novaJustificativaAlteracao.length}
              </span>
            </span>
          </Form.Label>
          <Col sm={6}>
            <Form.Control
              onChange={(e) => setNovaJustificativaAlteracao(e.target.value)}
              as="textarea"
              maxLength="500"
              rows="3"
              value={novaJustificativaAlteracao}
            />
          </Col>
        </Form.Group>
        {error && (
          <Alert variant="danger" className="mt-1">
            {error.map((e, i) => (
              <p key={i}>-{e}</p>
            ))}
          </Alert>
        )}
        {successEdit && (
          <Alert variant="success" className="mt-1">
            Sistema editado com sucesso!
          </Alert>
        )}
      </Form>

      <div className="buttons-container mb-5">
        <Button variant="light" onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Voltar
        </Button>

        <Button variant="light" onClick={(e) => editSystem(e)}>
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

export default EditSystemPage;
