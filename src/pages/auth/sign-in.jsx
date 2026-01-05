import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { routes } from "@/routes";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMaterialTailwindController } from "@/context";
// import Cookies from "js-cookie";
export function SignIn() {
  const navigate = useNavigate()
   const [controller, dispatch, { doLogin }] =  useMaterialTailwindController();
   const {loginData,loading} = controller;
  const [Form,setForm] = useState({
    Email:"",
    Password:""
  })
const [ErrorMessage, setErrorMessage] = useState({
  Email: "",
  Password: "",
});

  const handleChange = (e) => {
    setForm({...Form,[e.target.name]:e.target.value})
    // const userId = 4
    // const email = "esti@gmail.com"
  //   Cookies.set("userId", userId, {
  //   expires: 7,          // dura 7 días
  //   secure: true,        // solo HTTPS
  //   sameSite: "Strict",  // protege contra CSRF
  // });

  // Cookies.set("email", email, {
  //   expires: 7,
  //   secure: true,
  //   sameSite: "Strict",
  // });
  }
    const handleSubmit = async (e) => {
    try {
     
//       const userId = Cookies.get("userId");
// const email = Cookies.get("email");

// console.log("User ID:", userId);
// console.log("Email:", email);
// Cookies.remove("User ID")
   e.preventDefault(); 
   if (!validateForm()) {
    return; // NO enviar si hay errores
  }
  
      const result = await doLogin(Form);
     if(result.status == 200 && result.data.message == "login exitoso") handleLoginOk()
        // Validate Empty Password
     validateForm(result.data)
    
    } catch (error) {
      console.error("Error al guardar",error);
    }
  };

   const handleLoginOk = () => {
       // Search Dashboard Layout
    const dashboard = routes.find((r) => r.layout === "dashboard");
  
    // Buscar la página "home"
    // const page = dashboard.pages.find((p) => p.name === "Requerimiento");
 
    // Ruta final real: layout + path
    // const fullPath = `/${dashboard.layout}${page.path}`;
    const fullPath = `/${dashboard.layout}`;
    
    navigate(fullPath);
    };
  

 const validateForm = (data = null) => {
  let hasError = false;

  // Resetear errores antes de validar
  setErrorMessage({
    Email: "",
    Password: "",
  });

  // Validar email vacío
  if (!Form.Email.trim()) {
    setErrorMessage(prev => ({
      ...prev,
      Email: "El Email es obligatorio",
    }));
    hasError = true;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const emailRegexAcema = /^[a-zA-Z0-9._%+-]+@acemaingenieria\.com$/;
  if (Form.Email && !emailRegex.test(Form.Email)) {
    setErrorMessage(prev => ({
      ...prev,
      Email: "Ingrese un correo válido",
    }));
    hasError = true;
  }

  // Validar contraseña vacía
  if (!Form.Password.trim()) {
    setErrorMessage(prev => ({
      ...prev,
      Password: "La contraseña es obligatoria",
    }));
    hasError = true;
  }

   // Validate password less than 6 characters
if (Form.Password.length < 6) {
  setErrorMessage(prev => ({
    ...prev,
    Password: "La contraseña debe tener al menos 6 caracteres",
  }));
  hasError = true;
}

 if (data == "Usuario no encontrado") {
    setErrorMessage(prev => ({
      ...prev,
      Email: data,
    }));
    hasError = true;
   
  }
    if (data == "Contraseña incorrecta") {
    setErrorMessage(prev => ({
      ...prev,
      Password: data,
    }));
    hasError = true;
    
  }
  

  return !hasError;
};
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">INICIAR SECCIÓN</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Ingrese correo y contraseña</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Correo
            </Typography>
            <Input
              size="lg"
              placeholder="name@acemaingenieria.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
               
              }}
              name="Email"
              value={Form.Email}
              onChange={handleChange}
            />
            {ErrorMessage.Email &&(
              <p className="text-red-500 text-sm">{ErrorMessage.Email}</p>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="Password"
              value={Form.Password}
              onChange={handleChange}
              
            />
             {ErrorMessage.Password &&(
              <p className="text-red-500 text-sm mt-2">{ErrorMessage.Password}</p>
            )}
          </div>
         
          <Button className="mt-6" fullWidth type="submit">
           INICIAR SECCIÓN
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
           
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Olvide Contraseña
              </a>
            </Typography>
          </div>
       
          <Typography variant="paragraph" className="gap-2 mt-10 text-center text-blue-gray-500 font-medium">
            No estas Registrado?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create una cuenta</Link>
          </Typography>
        </form>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;
