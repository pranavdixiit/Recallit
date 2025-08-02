// client/src/pages/Review.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cards', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setCard(res.data.find(c => c._id === id)));
  }, [id]);

  const submit = quality => {
    axios.post(`http://localhost:5000/api/cards/${id}/review`, { quality }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => navigate('/dashboard'));
  };

  if (!card) return <div>Loading...</div>;

  return (
    <div>
      <h2>{card.question}</h2>
      <p>{card.answer}</p>
      {[0, 1, 2, 3, 4, 5].map(q => (
        <button key={q} onClick={() => submit(q)}>{q}</button>
      ))}
    </div>
  );
}
