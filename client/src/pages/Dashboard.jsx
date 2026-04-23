import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import api from '../utils/api';
import ItemForm from '../components/ItemForm';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return fetchItems();
    }
    try {
      const res = await api.get(`/items/search?name=${searchQuery}`);
      setItems(res.data);
    } catch (err) {
      console.error('Error searching items', err);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchItems();
  };

  const handleCreateOrUpdate = async (itemData) => {
    try {
      if (itemData === null) {
        // Cancel edit
        setEditingItem(null);
        return;
      }

      if (editingItem) {
        // Update
        await api.put(`/items/${editingItem._id}`, itemData);
        setEditingItem(null);
      } else {
        // Create
        await api.post('/items', itemData);
      }
      fetchItems();
    } catch (err) {
      console.error('Error saving item', err);
      alert(err.response?.data?.message || 'Error saving item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        console.error('Error deleting item', err);
        alert(err.response?.data?.message || 'Error deleting item');
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="mb-5">
      <h2 className="my-4">Dashboard</h2>

      <ItemForm 
        onSubmit={handleCreateOrUpdate} 
        initialData={editingItem} 
        key={editingItem ? editingItem._id : 'new-form'}
      />

      <hr className="my-5" />

      <Row className="mb-4 d-flex justify-content-between align-items-center">
        <Col md={4}>
          <h4>Reported Items</h4>
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search items by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={clearSearch}>Clear</Button>
              <Button variant="primary" type="submit">Search</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        {items.length === 0 ? (
          <Col><p>No items found.</p></Col>
        ) : (
          items.map(item => (
            <Col md={6} lg={4} key={item._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{item.itemName}</strong>
                  <Badge bg={item.type === 'Lost' ? 'danger' : 'success'}>{item.type}</Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{item.description}</Card.Text>
                  <p className="mb-1"><strong>Location:</strong> {item.location}</p>
                  <p className="mb-1"><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
                  <p className="mb-1"><strong>Contact:</strong> {item.contactInfo}</p>
                  <p className="mb-1 text-muted small">Reported by: {item.user?.name}</p>
                </Card.Body>
                {currentUser && item.user?._id === currentUser.id && (
                  <Card.Footer className="bg-white text-end">
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(item)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id)}>
                      Delete
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Dashboard;
