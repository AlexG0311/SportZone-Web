import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/home" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;