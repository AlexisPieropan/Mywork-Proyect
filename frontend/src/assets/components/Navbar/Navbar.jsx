// NavbarWithParallax.js
import  { useState, useEffect } from 'react';
import './Navbar.css/'
import Search from '../Search/Search';
import img1 from './img1.jpg';
import img2 from './img2.jpg'; 
import img3 from './img3.jpg'; 


const Navbar = () => {

  //LOGICA DE MOVIMIENTO DE IMGS
  const images = [img1, img2 , img3]; // Agrega más imágenes aquí
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      // Reducir gradualmente la opacidad al cambiar de imagen
      setOpacity((prevOpacity) => Math.max(prevOpacity - 0.1, 0));

      // Cambiar la imagen después de una breve pausa
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

        // Restablecer gradualmente la opacidad al mostrar la siguiente imagen
        setOpacity((prevOpacity) => Math.min(prevOpacity + 0.1, 1));
      }, 700);

    }, 5000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, [images.length]);


  //LOGICA DE DESPLIEGUE NAVBAR RESPONSIVE
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => {
    setMenuVisible(!menuVisible);
    console.log(menuVisible)
  };

  return (
    //NAVBAR:

    <div className="relative h-screen">
        {/* Fondo de parallax */}
        <div
          className="absolute top-0 left-0 w-full  h-4/5 bg-cover bg-center transition duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${images[currentIndex]})`, opacity}}
          >
        </div>

      {/* Contenido de la barra de navegación */}
      <nav className='bg-gray-800 py-6 relative'>
        <div className="container mx-auto flex px-8 xl:px-0">
          {/*IMAGEN DE LOGO AQUI SOLO SE DEBE REEMPLAZAR*/}
          <div className='flex flex-grow items-center lg:mr-7 '> 
            <img src="./Flag_of_None.svg.png" alt="none" /> 
          </div>
          {/*BTN AL HACERSE RESPONSIVE*/}
          <button
            style={{ fontSize: '2rem' }}
            onClick={openMenu}
            className="flex lg:hidden text-white hover:text-gray-300 focus:outline-none text-2xl"
              >
            ☰
          </button>
      
          {/*LOGICA PARA DESPLIEGUE DEL MENU RESPONSIVO*/}
          {menuVisible && (
            <div className='absolute top-20 bg-gray-800 w-full items-center lg:relative lg:hidden lg:top-0 left-0 py-14 lg:py-0 px-8 mb-8 '>

                <ul className='flex flex-col lg:flex-row text-center mb-8 lg:mb-0'>
                  <li className='text-white lg:mr-7 mb-8 lg:mb-0'>Inicio</li>
                  <li className='text-white lg:mr-7 mb-8 lg:mb-0 '>Servicios</li>
                  <li className='text-white lg:mr-7 mb-8 lg:mb-0'>Como funciona</li>
                  <li className='text-white lg:mr-7 mb-8 lg:mb-0'>Acerca de</li>
                </ul>
                  <div className='flex flex-col lg:flex-row text-center'>
                    <button className="btnIniSesion mb-8">Iniciar Sesion</button>
                    <button className="btnCrearUs">Crear Cuenta</button>
                  </div>
              </div>
          )}

                {/*BTNES DE LA NAVBAR*/}
              <div className='lg:flex hidden flex-grow justify-between lg:relative lg:top-0'>
                <ul className='flex'>
                  <li className="hover:bg-gray-700 py-2 px-2 rounded cursor-pointer text-white lg:mr-7 transition duration-500 ease-in-out">Inicio</li>
                  <li className="hover:bg-gray-700 py-2 px-2 rounded cursor-pointer text-white lg:mr-7 transition duration-500 ease-in-out">Servicios</li>
                  <li className="hover:bg-gray-700 py-2 px-2 rounded cursor-pointer text-white lg:mr-7 transition duration-500 ease-in-out">Cómo Funciona</li>
                  <li className="hover:bg-gray-700 py-2 px-2 rounded cursor-pointer text-white lg:mr-7 transition duration-500 ease-in-out">Acerca de</li>
                </ul>
                  <div >
                    <button className="btnIniSesion ">Iniciar Sesion</button>
                    <button className="btnCrearUs">Crear Cuenta</button>
                  </div>
          </div>

          
        </div>
      </nav>

    </div> //CIERRE DEL DIV PRINCIPAL 
  );
};

export default Navbar;
