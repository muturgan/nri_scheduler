import { h } from 'preact';
import { TargetedEvent, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import './registration.css';

export const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        // Здесь можно добавить логику для отправки данных на сервер
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        setError('');
    };

    return (
        <div className="registration-page">
            <Card title="Регистрация" className="registration-card">
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="username">Имя пользователя</label>
                            <InputText
                                id="username"
                                value={username}
                                // @ts-ignore
                                onChange={(e) => setUsername(e.target?.['value'])}
                                required
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={email}
                                // @ts-ignore
                                onChange={(e: TargetedEvent) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="password">Пароль</label>
                            <Password
                                id="password"
                                value={password}
                                // @ts-ignore
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="confirmPassword">Подтвердите пароль</label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                // @ts-ignore
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <Message severity="error" text={error} />}
                        <Button label="Зарегистрироваться" type="submit" className="p-mt-3" />
                    </div>
                </form>
            </Card>
        </div>
    );
};
