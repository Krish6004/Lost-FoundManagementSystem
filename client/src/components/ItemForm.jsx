import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const ItemForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      itemName: '',
      description: '',
      type: 'Lost',
      location: '',
      date: '',
      contactInfo: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>{initialData ? 'Update Item' : 'Report New Item'}</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <Form.Group className="col-md-6 mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="col-md-6 mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-12 mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                required
                value={formData.date ? formData.date.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="col-md-4 mb-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              />
            </Form.Group>
          </div>
          <Button variant="primary" type="submit">
            {initialData ? 'Update Item' : 'Submit Item'}
          </Button>
          {initialData && (
            <Button variant="secondary" className="ms-2" onClick={() => onSubmit(null)}>
              Cancel
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ItemForm;
