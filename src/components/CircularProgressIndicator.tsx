import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/esm/Spinner";

export const CircularProgressIndicator = () => (
  <Container className="d-flex align-items-center justify-content-center w-100 h-100">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Container>
);
