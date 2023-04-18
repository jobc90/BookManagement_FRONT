/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { FiUser, FiLock } from 'react-icons/fi';
import LoginInput from '../../components/UI/login/LoginInput/LoginInput';
import { BiRename } from 'react-icons/bi';
import axios from 'axios';
const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 30px;
`;

const logo = css`
    margin: 50px 0px;
    font-size: 34px;
    font-weight: 600;
`;

const mainContainer = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #dbdbdb;
    border-radius: 10px;
    padding: 40px 20px;
    width: 400px;
`;

const authForm = css`
    width: 100%;
`;

const inputLabel = css`
    margin-left: 10px;
    font-size: 12px;
    font-weight: 600;
`;


const loginButton = css`
    margin: 10px 0px;
    border: 1px solid #dbdbdb;
    border-radius: 6px;
    width: 100%;
    height: 50px;
    background-color: white;
    font-weight: 900;

    &:hover {
        background-color: #fafafa;
    }
    &:active {
        background-color: #eee;
    }
`;


const signupMessage = css`
    margin-top: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #777;
`;

const register = css`
    margin-top: 10px;
    font-weight: 900;
`;


const Register = () => {
    const [registerUser, setRegisterUser] = useState({ email: "", password: "", name: "" })

    const onChangehandle = (e) => {
        const { name, value} = e.target;
        setRegisterUser({...registerUser, [name]: value})
    }
    const registSubmit = () => {
        const data = {
            ...registerUser
        }
        const option = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        axios
        .post("http://localhost:8080/auth/signup", JSON.stringify(data), option)
        .then(response => {
            console.log("성공");
            console.log(response);
        })
        .catch(error => {
            console.log("에러");
            console.log(error.response.data.errorData);
        });
        console.log("비동기 테스트")
    }

    return (
        <div css={container}>
            <header>
                <h1 css={logo}>SIGN UP</h1>
            </header>
            <main css={mainContainer}>
                <div css={authForm}>
                    <label css={inputLabel}>Email</label>
                    <LoginInput type="email" placeholder="Type your email" onChange={onChangehandle} name="email">
                        <FiUser/>
                    </LoginInput>
                    <label css={inputLabel}>Password</label>
                    <LoginInput type="password" placeholder="Type your password" onChange={onChangehandle} name="password">
                        <FiLock/>
                    </LoginInput>
                    <label css={inputLabel}>Name</label>
                    <LoginInput type="text" placeholder="Type your name" onChange={onChangehandle} name="name">
                        <BiRename/>
                    </LoginInput>

                    <button css={loginButton} onClick={registSubmit}>REGISTER</button>
                </div>
            </main>
            
            <div css={signupMessage}>Already a user?</div>

            <footer>
                <div css={register}><Link to="/login">LOGIN</Link></div>
            </footer>
        </div>
    );
};

export default Register;