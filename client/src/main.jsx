import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { SocketProvider } from './SocketProvider.jsx'

const client = new ApolloClient({
  uri: `${import.meta.env.VITE_BASE_URL}/graphql`,
  // uri: 'https://90b8ecb1f92f.ngrok-free.app/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
