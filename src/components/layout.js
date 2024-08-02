import React from 'react';
import { Container, Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;


