

import { Typography, IconButton } from "@material-tailwind/react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t py-6 px-6 ">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo + Información */}
        <div className="flex items-center gap-4">
          <img
            src="/img/logo-acema.png"
            alt="ACEMA Ingeniería"
            className="w-20 h-auto"
          />

          <div>
            <Typography variant="h6" className="font-bold text-blue-gray-900">
              ACEMA Ingeniería
            </Typography>

            <Typography className="text-sm text-blue-gray-600">
              Innovación y soluciones integrales para la industria.
            </Typography>

            <Typography className="text-sm text-blue-gray-500 mt-2">
              © {year} ACEMA Ingeniería. Todos los derechos reservados.
            </Typography>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-3">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/people/Acema-Ingeniería/61575678797261/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton color="blue" variant="text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.5228-4.4772-10-10-10S2 6.4772 2 12c0 4.9912 3.657 9.1283 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.5061 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46H15.83c-1.395 0-1.827.867-1.827 1.756v2.105h3.11l-.497 2.89h-2.613V21.88C18.343 21.13 22 16.991 22 12z" />
              </svg>
            </IconButton>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/acema_ingenieria/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton color="pink" variant="text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308C2.163 18.23 1.892 16.963 1.83 15.597 1.772 14.331 1.76 13.951 1.76 10.747s.012-3.584.07-4.85c.062-1.366.333-2.633 1.308-3.608C4.113 1.495 5.38 1.224 6.746 1.162 8.012 1.104 8.392 1.092 11.596 1.092zm0 1.65c-3.17 0-3.532.012-4.778.07-1.032.047-1.595.218-1.968.59-.374.374-.544.937-.59 1.97-.058 1.245-.07 1.607-.07 4.777s.012 3.532.07 4.778c.046 1.032.217 1.595.59 1.968.373.373.936.544 1.968.59 1.246.058 1.607.07 4.778.07s3.532-.012 4.778-.07c1.032-.046 1.595-.217 1.968-.59.373-.373.544-.936.59-1.968.058-1.246.07-1.608.07-4.778s-.012-3.532-.07-4.778c-.046-1.032-.217-1.595-.59-1.968-.373-.373-.936-.544-1.968-.59-1.246-.058-1.608-.07-4.778-.07zm0 3.893a4.947 4.947 0 1 1 0 9.894 4.947 4.947 0 0 1 0-9.894zm5.2-3.863a1.155 1.155 0 1 1 0-2.31 1.155 1.155 0 0 1 0 2.31z" />
              </svg>
            </IconButton>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/acema-ingeniería/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton color="blue" variant="text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.983 3.5C3.87 3.5 3 4.37 3 5.483c0 1.09.84 1.983 1.983 1.983 1.11 0 1.983-.893 1.983-1.983C6.966 4.37 6.093 3.5 4.983 3.5zM3.25 21h3.5V8.75h-3.5V21zm7.75 0h3.5v-6.562c0-1.75.56-2.94 2.27-2.94 1.64 0 2.23 1.117 2.23 2.94V21h3.5v-7.75c0-3.89-2.11-5.69-4.94-5.69-2.23 0-3.24 1.23-3.78 2.09h.03V8.75h-3.5C10.29 8.75 10.5 21 10.5 21z" />
              </svg>
            </IconButton>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
