import React, { useState } from "react";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  InputGroup,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { login } from "../../services/auth";
import api from "../../services/api";

import * as yup from "yup";

import { useHistory } from "react-router-dom";

export default function RegisterPage() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [register, setRegister] = useState(false);

  const registerSchema = yup.object().shape({
    email: yup
      .string()
      .email("informe um email válido")
      .required("O email é obrigatório"),
    password: yup
      .string()
      .required("A senha é obrigatória")
      .matches(
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/,
        "A senha deve conter no mínimo 8 caracteres, uma letra maíuscula, uma minúscula, um número e um caractere especial"
      ),
    confirmPassword: yup
      .string()
      .required("A confirmação de senha é obrigatória")
      .oneOf([yup.ref("password")], "As senhas devem ser iguais"),
  });

  const Register = async (e) => {
    e.preventDefault();
    const valid = await registerSchema.isValid({
      email,
      password,
      confirmPassword,
    });

    registerSchema
      .validate(
        {
          email,
          password,
          confirmPassword,
        },
        { abortEarly: false }
      )
      .catch(({ errors }) => setError(errors));

    if (valid) {
      setIsLoading(true);
      try {
        const res = await api.post("/auth/nova-conta", {
          email,
          password,
          confirmPassword,
        });

        setRegister(true);
        setIsLoading(false);
        await setTimeout(() => login(res.data), 2000);
      } catch (error) {
        setIsLoading(false);

        const { response } = error;

        const duplicatedUserName = response?.data.filter(
          (error) => error.code === "DuplicateUserName"
        );

        if (duplicatedUserName) {
          return setError([
            "Email informado já está sendo usado por outro usuário!",
          ]);
        }

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
    <Row>
      <Col>
        <Form id="register-form" className="bg-white rounded p-30">
          <h2 className="text-dark mb-3">Registrar</h2>

          <Form.Group controlId="formBasicEmail">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                type="email"
                placeholder="Email"
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FontAwesomeIcon icon={faKey} />
                </InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                type="password"
                placeholder="Senha"
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="formBasicConfirmPassword">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FontAwesomeIcon icon={faKey} />
                </InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
                type="password"
                placeholder="Confirmação de senha"
                disabled={isLoading}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </InputGroup>
            {error && (
              <Alert variant="danger" className="mt-1">
                {error.map((e, i) => (
                  <p key={i}>-{e}</p>
                ))}
              </Alert>
            )}
            {register && (
              <Alert variant="success" className="mt-1">
                Cadastro efetuado com sucesso!
              </Alert>
            )}
          </Form.Group>
          <Button
            variant="primary"
            className="w-100 mt-2"
            type=" "
            disabled={isLoading}
            onClick={(e) => Register(e)}
          >
            {!isLoading ? "Registrar" : "Registrando..."}
            {!isLoading ? null : (
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
          <Button
            variant="secondary"
            className="w-100 mt-1"
            disabled={isLoading}
            onClick={() => history.push("/login")}
          >
            Entrar
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
