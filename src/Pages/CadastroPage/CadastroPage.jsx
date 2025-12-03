// src/Pages/Pages/CadastroPage/CadastroPage.jsx

import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext.jsx'; 
import './CadastroPage.styles.css'; 

function CadastroPage() {
    const navigate = useNavigate(); 
    const auth = useAuth(); 
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [feedback, setFeedback] = useState({ message: '', type: '' }); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isStrongPassword = (password) => {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /\d/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setFeedback({ message: '', type: '' });
        
        if (!isValidEmail(formData.email)) {
            setFeedback({ message: "Formato de email inválido!", type: 'error' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setFeedback({ message: "As senhas não coincidem!", type: 'error' });
            return;
        }

        if (!isStrongPassword(formData.password)) {
            setFeedback({ 
                message: "Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.", 
                type: 'error' 
            });
            return;
        }

        try {
            const result = await auth.register(
                formData.username, 
                formData.email, 
                formData.password
            ); 
            
            if (result.success) {
                setFeedback({ message: "Cadastro completo! Fazendo login automático...", type: 'success' });

                const loginResult = await auth.login(formData.email, formData.password);

                if (loginResult.success) {
                    navigate('/dashboard'); 
                } else {
                    setFeedback({ message: "Falha no login automático. Tente fazer login manualmente.", type: 'error' });
                    navigate('/login');
                }
                
            } else {
                setFeedback({ message: result.message || "Erro desconhecido ao cadastrar.", type: 'error' });
            }

        } catch (error) {
            console.error("Erro na comunicação com o servidor:", error);
            setFeedback({ message: "Erro de rede. Servidor indisponível.", type: 'error' });
        }
    };

    return (
        <div className="cadastro-page-container">
            <div className="cadastro-form-wrapper">
                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <h2>Crie sua conta</h2>

                    {feedback.message && (
                        <p className={`feedback-${feedback.type}`} style={{ 
                            color: feedback.type === 'error' ? 'red' : 'green', 
                            fontWeight: 'bold' 
                        }}>
                            {feedback.message}
                        </p>
                    )}
                    
                    <div className="input-group">
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Nome de usuário" 
                            required 
                            value={formData.username} 
                            onChange={handleChange}     
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            required 
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="input-group">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Senha" 
                            required 
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirmar Senha" 
                            required 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <button type="submit" className="cadastro-button">
                        Cadastrar
                    </button>
                    
                    <div className="login-link">
                        <p>Já tem uma conta? <a href="/login">Faça login</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastroPage;
