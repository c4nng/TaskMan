import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  height: 100vh;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #111827;
  font-size: 1.6rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  transition: 0.3s;
  margin-top: 0.5rem;

  &:hover {
    background-color: #059669;
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #475569;

  a {
    color: #10b981;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Eğer giriş yaptıysa tekrar kayıt sayfasına gelmesin
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      navigate('/login');
    } else {
      alert(data.message || '❌ Kayıt başarısız');
    }
  };

  return (
    <Container>
      <Card>
        <Title>Kayıt Ol</Title>
        <form onSubmit={handleRegister}>
          <Input
            type="name"
            placeholder="Email adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Kayıt Ol</Button>
        </form>
        <Text>
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </Text>
      </Card>
    </Container>
  );
};

export default Register;
