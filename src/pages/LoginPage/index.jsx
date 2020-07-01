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
import api from "../../services/api";
import { login } from "../../services/auth";
import * as yup from "yup";
import { useHistory, Link } from "react-router-dom";

export default function LoginPage() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const loginSchema = yup.object().shape({
    email: yup.string().email("Email inválido").required("Email é obrigatório"),
    password: yup.string().required("Senha obrigatória"),
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const valid = await loginSchema.isValid({ email, password });

    if (!valid) return setError("Todos os campos devem ser preenchidos");

    if (valid) {
      try {
        setIsLoading(true);
        const res = await api.post(`/auth/login`, {
          email,
          password,
        });

        login(res.data);
        history.push("/dashboard");
      } catch (error) {
        setIsLoading(false);

        if (error.response.status === 400)
          return setError(["Email ou senha incorretos!"]);
        setError(
          "Verifique sua conexão, se o problema persistir tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <Row>
      <Col>
        <Form
          id="login-form"
          className="bg-white rounded p-30"
          onSubmit={(e) => handleLogin(e)}
        >
          <h2 className="text-dark mb-3">Entrar</h2>

          <Form.Group controlId="formBasicEmail">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FontAwesomeIcon icon={faEnvelope} />
                </InputGroup.Text>
              </InputGroup.Prepend>

              <Form.Control
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
            {error && (
              <Alert variant="danger" className="mt-1">
                {error}
              </Alert>
            )}
          </Form.Group>
          <Button
            variant="primary"
            className="w-100 mt-2"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Entrar" : "Entrando..."}
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
            onClick={() => history.push("/register")}
          >
            <Link to="/register">Registrar</Link>
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
