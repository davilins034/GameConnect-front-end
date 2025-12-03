// src/Pages/LoginPage/LoginPage.jsx

import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ResetPasswordModal from '../../components/ResetPasswordModal.jsx';

import {
  LoginPageContainer,
  LoginCard,
  Title,
  Form,
  Input,
  MainButton,
  Separator,
  LinkText,
  DiscordButton,
  GoogleButton,
  SteamButton,
} from './LoginPage.styles.js'; 

function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validação simples de email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = async (event) => { 
    event.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert("Formato de email inválido.");
      return;
    }

    const result = await auth.login(formData.email, formData.password); 
    
    if (result.success) {
        navigate('/dashboard');
    } else {
        alert(result.message || "Erro no login. Verifique suas credenciais.");
    }
  };
  
  const handleSocialLogin = (platform) => {
      console.log(`Iniciando login com ${platform}...`);
      alert(`Função de login com ${platform} ativada!`);
  };

  return (
    <LoginPageContainer>
      {isResetModalOpen && (
        <ResetPasswordModal onClose={() => setIsResetModalOpen(false)} />
      )}

      <LoginCard>
        <Title>Bem-vindo de volta!</Title>
        
        <Form onSubmit={handleLoginSubmit}>
          <Input 
            type="email" 
            required 
            placeholder="Email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
          />
          <Input 
            type="password" 
            required 
            placeholder="Senha" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <MainButton type="submit">Entrar</MainButton>
        </Form>

        <LinkText onClick={() => setIsResetModalOpen(true)}>
          Esqueceu sua senha?
        </LinkText>

        <Separator>OU</Separator>

        <DiscordButton onClick={() => handleSocialLogin('Discord')}>
          Continuar com Discord
        </DiscordButton>
        <GoogleButton onClick={() => handleSocialLogin('Google')}>
          Continuar com Google
        </GoogleButton>
        <SteamButton onClick={() => handleSocialLogin('Steam')}>
          Continuar com Steam
        </SteamButton>
        
        <LinkText onClick={() => navigate('/cadastro')}>
          Não tem uma conta? Cadastre-se
        </LinkText>
      </LoginCard>
    </LoginPageContainer>
  );
}

export default LoginPage;
