import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFinal, setShowFinal] = useState(false); // pantalla 3
  const navigate = useNavigate();

 const slides = [
    {
      image: "/src/assets/imagenes/inicio.svg",
      title: "Resumen Financiero",
      text: "En la pantalla de inicio encontrarás un resumen claro y actualizado de tus ingresos y gastos totales. La aplicación calcula automáticamente tus operaciones, agrupándolas por moneda para ofrecerte mayor precisión. Además, incorpora el valor real del mercado informal cubano, obtenido de El Toque, para mantenerte siempre informado. De esta forma, podrás tomar decisiones financieras con mayor confianza y control sobre tu economía personal.",
    },
    {
      image: "/src/assets/imagenes/ingresosGastos.svg",
      title: "Registrar Movimientos",
      text: "En esta sección podrás registrar fácilmente tus movimientos financieros. Selecciona entre ingresos o gastos y utiliza el formulario para agregar cada operación de manera detallada. Esto te permitirá mantener un control claro y ordenado de tus finanzas personales. Cada registro se integrará automáticamente a tu balance general para ofrecerte una visión completa de tu economía..",
    },
    {
      image: "/src/assets/imagenes/negocios.svg",
      title: "Formularios Personalizados",
      text: "En esta sección podrás crear tu propio formulario personalizado según las necesidades de tu negocio. A través de un subformulario, podrás añadir y organizar los campos que desees incluir en tu formulario principal. Esto te brinda la flexibilidad de adaptar la herramienta a distintos tipos de gestión o seguimiento. Diseña tu flujo de trabajo de manera sencilla y eficiente, optimizando la información que realmente necesitas.",
    },
    {
      image: "/src/assets/imagenes/calculadora.svg",
      title: "Calculadora de Billetes",
      text: "En esta sección podrás registrar tus billetes de manera rápida y precisa. Simplemente ingresa la cantidad de cada denominación y multiplícala por el valor indicado a su lado. La aplicación calculará automáticamente la suma total y la mostrará en la parte superior. Así tendrás un control claro y confiable de tus fondos en todo momento.",
    },
    {
      image: "/src/assets/imagenes/estadisticas.svg",
      title: "Análisis de Movimientos",
      text: "En esta sección podrás registrar tus billetes de manera rápida y precisa. Simplemente ingresa la cantidad de cada denominación y multiplícala por el valor indicado a su lado. La aplicación calculará automáticamente la suma total y la mostrará en la parte superior. Así tendrás un control claro y confiable de tus fondos en todo momento.",
    },
   ];

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenWelcome");

    if (hasSeen === "true") {
      // Usuario ya vio la intro: mostrar solo pantalla 3
      setShowSplash(false);
      setShowIntro(false);
      setShowFinal(true);
    } else {
      // Primera vez: mostrar splash y luego intro
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
      // Final del slider
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
        transition: "background 1s ease-in-out",
        zIndex: 9999,
      }}
    >
      {/* 🌟 Pantalla 1: Splash */}
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

      {/* 💡 Pantalla 2: Slider */}
      <Fade in={showIntro} timeout={1000}>
        <Box
          sx={{
            display: showIntro ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            width: "100%",
            textAlign: "center",
            px: 3,
            py: 4,
            position: "relative",
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
              Skip
            </Typography>
          </Box>

          {/* Imagen y texto */}
          <Box sx={{ mt: "18%" }}>
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
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700 }}>
              {slides[currentSlide].title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fcefee", mt: 1, px: 2 }}>
              {slides[currentSlide].text}
            </Typography>
          </Box>

          {/* Botones */}
          <Box
            sx={{
              position: "absolute",
              bottom: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 2,
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
      </Fade>

      {/* 🚀 Pantalla 3: Final */}
      <Fade in={showFinal} timeout={1000}>
        <Box
          sx={{
            display: showFinal ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            height: "100%",
            width: "100%",
            px: 3,
            position: "relative",
          }}
        >
          <Box sx={{ mt: "70%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ mt: "-80%" }}>
              <img
                src="/logo/logo2.2.svg"
                alt="Logo"
                width="80%"
                height="100%"
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
              Bienvenidos
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#fcefee", mb: 3 }}>
              Mis cuentas
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff", mb: 4, mt: "10%" }}>
              Toma el control de tus finanzas. <br />
              Crea una cuenta y estarás listo para empezar.
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#fff",
                color: "#764ba2",
                borderRadius: "25px",
                px: 5,
                py: 1,
                mb: 2,
                "&:hover": { backgroundColor: "#f5f5f5" },
                mt: "30%",
              }}
              onClick={() => navigate("/register")}
            >
              REGISTRARSE
            </Button>
          </Box>

          <Box sx={{ position: "absolute", bottom: "10%" }}>
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
