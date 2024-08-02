import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase';
import { collection, getDocs, query, setDoc, deleteDoc, doc } from 'firebase/firestore';
import Layout from '../components/layout'; // Adjust the import path as needed

const updateInventory = async (setItems, setFilteredItems, setTotal) => {
  const snapshot = query(collection(firestore, 'inventory'));
  const docs = await getDocs(snapshot);
  const itemsList = [];
  docs.forEach((doc) => {
    itemsList.push({ id: doc.id, ...doc.data() });
  });
  setItems(itemsList);
  setFilteredItems(itemsList);

  const totalPrice = itemsList.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  setTotal(totalPrice);

  console.log('Updated inventory:', itemsList); // Log updated inventory
};

const addItem = async (newItem, setNewItem, updateInventory, setItems, setFilteredItems, setTotal) => {
  if (newItem.name !== '' && newItem.price !== '') {
    const docRef = doc(collection(firestore, 'inventory'));
    await setDoc(docRef, { name: newItem.name.trim(), price: newItem.price, quantity: 1 });
    setNewItem({ name: '', price: '' });
    await updateInventory(setItems, setFilteredItems, setTotal);
  }
};

const updateItemQuantity = async (id, quantity, updateInventory, setItems, setFilteredItems, setTotal) => {
  const docRef = doc(firestore, 'inventory', id);
  if (quantity === 0) {
    await deleteDoc(docRef);
  } else {
    await setDoc(docRef, { quantity }, { merge: true });
  }
  await updateInventory(setItems, setFilteredItems, setTotal);
};

const Home = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    updateInventory(setInventory, setFilteredItems, setTotal);
  }, []);

  const handleSearch = () => {
    const filtered = inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredItems(filtered);
  };

  return (
    <Layout>
      <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>Pantry Tracker</Typography>
        <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Box component="form" onSubmit={(e) => {
            e.preventDefault();
            addItem(newItem, setNewItem, updateInventory, setInventory, setFilteredItems, setTotal);
          }} sx={{ display: 'flex', mb: 2 }}>
            <TextField
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              label="Enter Item"
              fullWidth
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <TextField
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              label="Enter Price"
              type="number"
              fullWidth
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">+</Button>
          </Box>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              label="Search"
              fullWidth
              variant="outlined"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
          </Box>
          <List>
            {filteredItems.map((item, id) => (
              <ListItem key={id} sx={{ mb: 1, bgcolor: 'background.default', borderRadius: 1, boxShadow: 1 }}>
                <ListItemText primary={item.name} secondary={`$${item.price} x ${item.quantity}`} />
                <Box>
                  <IconButton onClick={() => updateItemQuantity(item.id, item.quantity + 1, updateInventory, setInventory, setFilteredItems, setTotal)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => updateItemQuantity(item.id, item.quantity - 1, updateInventory, setInventory, setFilteredItems, setTotal)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => updateItemQuantity(item.id, 0, updateInventory, setInventory, setFilteredItems, setTotal)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
          {filteredItems.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Home;
