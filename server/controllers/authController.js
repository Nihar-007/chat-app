export const register = (req, res) => {
  const { username, password } = req.body;
  
  res.status(201).json({ message: 'User registered successfully', user: { username } });
}

export const login = (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'test' && password === 'password') {
    res.status(200).json({ message: 'Login successful', user: { username } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

export const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
}