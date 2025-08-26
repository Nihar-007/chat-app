import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation CreateUser($name: String!, $phno: String!, $email: String!, $password: String!) {
        createUser(name: $name, phno: $phno, email: $email, password: $password){
            message
        }
        
    }
`
export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            id
            name
            phno
            email
        }   
    }
`