import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios';


// Pages
import Home from './pages/Home';
import Importacoes from './pages/Importacoes';
import DownloadREM from './pages/DownloadREM'

// Components
import Header from './components/Header'

// Definindo as cores como variáveis
const colors = {
  darkGreen: "#408d86",
  green: "#26A69A",
  lightGreen: "#80CBC4",
  veryLightGreen: "#cdfaf6",
  paleGreen: "#D0EBEA",
  palestGreen: "#E0F2F1",
  white: "#FFFFFF",
  black: "#263339",
  gray: "#728f9e",
};


const darkTheme = createTheme({
  palette: {
    primary: {
      main: colors.darkGreen,
      light: colors.green,
      dark: colors.black,
    },
    accent: {
      main: colors.paleGreen,
      light: colors.palestGreen,
    },
    text: {
      light: colors.white,
      primary: colors.white,
      secondary: colors.grey,
      green: colors.green,
      yellow: "#f2a243",
      red: "#f44336",
      blue: "#90caf9",
      success: "#81c784",
      warning: "#ffb74d",
    },
    background: {
      header: colors.green,
      paper: "#1D1F21",
      green: colors.green,
      yellow: "#f2a243",
      red: "#f44336",
      blue: "#90caf9",
      default: "#2c2e30",
      dark: "#444648",
    },
  },
  overrides: {
    MuiInput: {
      input: {
        color: colors.white,
        "&[disabled]": {
          color: "#dedede",
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    primary: {
      main: colors.darkGreen,
      light: colors.green,
      dark: colors.green,
    },
    secondary: {
      main: colors.white,
    },
    accent: {
      main: "#1D1F21",
      light: "#7a7a7a",
    },
    text: {
      light: colors.white,
      primary: colors.darkGreen,
      secondary: colors.darkGreen,
      green: colors.green,
      yellow: "#f2a243",
      red: "#f44336",
      blue: "#90caf9",
      success: "#388e3c",
      warning: "#f57c00",
    },
    background: {
      header: colors.white,
      paper: colors.white,
      green: colors.green,
      yellow: "#f2a243",
      red: "#f44336",
      blue: "#90caf9",
      default: colors.paleGreen,
      dark: colors.grey,
    },
  },
});

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme
  );
  useEffect(() => {
    localStorage.setItem("theme", theme === darkTheme ? "dark" : "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === darkTheme ? lightTheme : darkTheme);
  };

  // Função para verificar se há um usuário armazenado no sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    // set in sessionStorage
    console.log(decoded);
    sessionStorage.setItem('user', JSON.stringify(decoded));

    axios.post('https://rem.nexustech.net.br/api_rem/busca_dados_empresa.php', { parceiro: decoded.email })
      .then((response) => {
        console.log(response.data)
        if (response.data.success) {
          setUser({ ...user, empresa: response.data.empresa });
        } else {
          console.log('Erro ao buscar empresa');
        }
      })
    
  };

  const handleLogout = () => {
    setUser(null); // Limpa os dados do usuário ao fazer logout
    // remove from sessionStorage
    sessionStorage.removeItem('user');
    // Navigate to home page after logout
    navigate('/');
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  return (
    <ThemeProvider theme={theme}>
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      ) : (
        <div>
          <Header user={user} handleLogout={handleLogout} />
          <div style={{ width: '80%', margin: '20px auto 0 auto' }}>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/importacoes" element={<Importacoes user={user} />} />
            </Routes>
          </div>
        </div>
      )}
    </ThemeProvider>
  )
}

export default App;
