import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";

import inicio from "../../public/imagenes/inicio.png";
import calculadora from "../../public/imagenes/calculadora.png";
import negocios from "../../public/imagenes/negocios.png";
import estadisticas from "../../public/imagenes/estadisticas.png";
import ingresosGastos from "../../public/imagenes/ingresosGastos.png";

const WelcomePage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const navigate = useNavigate();

  const slides = [
    {
      image: inicio,
      title: "Resumen Financiero",
      text: "En la pantalla de inicio encontrarás un resumen claro y actualizado de tus ingresos y gastos totales. La aplicación calcula automáticamente tus operaciones, agrupándolas por moneda para ofrecerte mayor precisión. Además, incorpora el valor real del mercado informal cubano, obtenido de El Toque, para mantenerte siempre informado. De esta forma, podrás tomar decisiones financieras con mayor confianza y control sobre tu economía personal.",
    },
    {
      image: ingresosGastos,
      title: "Registrar Movimientos",
      text: "En esta sección podrás registrar fácilmente tus movimientos financieros. Selecciona entre ingresos o gastos y utiliza el formulario para agregar cada operación de manera detallada. Esto te permitirá mantener un control claro y ordenado de tus finanzas personales. Cada registro se integrará automáticamente a tu balance general para ofrecerte una visión completa de tu economía.",
    },
    {
      image: negocios,
      title: "Formularios Personalizados",
      text: "En esta sección podrás crear tu propio formulario personalizado según las necesidades de tu negocio. A través de un subformulario, podrás añadir y organizar los campos que desees incluir en tu formulario principal. Esto te brinda la flexibilidad de adaptar la herramienta a distintos tipos de gestión o seguimiento. Diseña tu flujo de trabajo de manera sencilla y eficiente, optimizando la información que realmente necesitas.",
    },
    {
      image: calculadora,
      title: "Calculadora de Billetes",
      text: "En esta sección podrás registrar tus billetes de manera rápida y precisa. Simplemente ingresa la cantidad de cada denominación y multiplícala por el valor indicado a su lado. La aplicación calculará automáticamente la suma total y la mostrará en la parte superior. Así tendrás un control claro y confiable de tus fondos en todo momento.",
    },
    {
      image: estadisticas,
      title: "Análisis de Movimientos",
      text: "En esta sección podrás analizar tus movimientos financieros y obtener estadísticas claras para tomar decisiones acertadas sobre tu dinero. La aplicación muestra gráficos y resúmenes de manera precisa y confiable.",
    },
  ];

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenWelcome");

    if (hasSeen === "true") {
      setShowSplash(false);
      setShowIntro(false);
      setShowFinal(true);
    } else {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowIntro(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      localStorage.setItem("hasSeenWelcome", "true");
      setShowIntro(false);
      setShowFinal(true);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowIntro(false);
    setShowFinal(true);
  };

  const handleBack = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100dvh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      {/* Splash */}
      <Fade in={showSplash} timeout={1500}>
        <Box
          sx={{
            position: "absolute",
            display: showSplash ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <img
              src="/logo/logo2.2.svg"
              alt="Logo"
              width={200}
              height={200}
              style={{ objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Mis Cuentas
          </Typography>
        </Box>
      </Fade>

      {/* INTRO SLIDES */}
      {showIntro && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            textAlign: "center",
            px: 3,
            py: 3,
            overflowY: "auto",
          }}
        >
          {/* Skip */}
          <Box sx={{ position: "absolute", top: "5%", right: "6%" }}>
            <Typography
              variant="body1"
              sx={{
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={handleSkip}
            >
              omitir
            </Typography>
          </Box>

          {/* CONTENIDO */}
          <Box sx={{ mt: "20%" }}>
            <Fade key={currentSlide + "-img"} in timeout={500}>
              <Box
                component="img"
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                sx={{
                  width: "80%",
                  maxWidth: 280,
                  mb: 3,
                }}
              />
            </Fade>

            <Fade key={currentSlide + "-title"} in timeout={500}>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
                {slides[currentSlide].title}
              </Typography>
            </Fade>

            <Fade key={currentSlide + "-text"} in timeout={500}>
              <Typography variant="body2" sx={{ color: "#fcefee", mt: 1 }}>
                {slides[currentSlide].text}
              </Typography>
            </Fade>
          </Box>

          {/* BOTONES — SIEMPRE ABAJO */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: "auto",
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                borderRadius: "25px",
                px: 4,
                minWidth: 110,
              }}
              onClick={handleBack}
              disabled={currentSlide === 0}
            >
              Back
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#764ba2",
                borderRadius: "25px",
                px: 4,
                minWidth: 110,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={handleNext}
            >
              {currentSlide === slides.length - 1 ? "Continuar" : "Next"}
            </Button>
          </Box>
        </Box>
      )}

      {/* FINAL */}
      <Fade in={showFinal} timeout={1000}>
        <Box
          sx={{
            display: showFinal ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            height: "100%",
            px: 3,
            py: 3,
            overflowY: "auto", // 👈 HABILITA SCROLL SI FALTA ESPACIO
            position: "relative",
          }}
        >
          {/* LOGO */}
          <Box sx={{ mt: 4 }}>
            <img
              src="/logo/logo2.2.svg"
              alt="Logo"
              width="80%"
              style={{ objectFit: "contain" }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{ color: "#fff", fontWeight: 700, mt: 4 }}
          >
            Bienvenidos
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "#fcefee", mb: 3 }}>
            Mis cuentas
          </Typography>

          <Typography variant="body2" sx={{ color: "#fff", mb: 4 }}>
            Toma el control de tus finanzas. <br />
            Crea una cuenta y estarás listo para empezar.
          </Typography>

          {/* BOTÓN PRINCIPAL */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#fff",
              color: "#764ba2",
              borderRadius: "25px",
              px: 5,
              py: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
            onClick={() => navigate("/register")}
          >
            REGISTRARSE
          </Button>

          {/* ENLACE INICIAR SESIÓN (SIEMPRE VISIBLE CON SCROLL) */}
          <Box sx={{ mt: 6, mb: 8 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              ¿Ya tienes una cuenta? Inicia sesión.
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default WelcomePage;
