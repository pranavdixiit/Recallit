// src/pages/Dashboard.js

import { format } from 'date-fns';
import React, { useState, useEffect, useMemo } from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import defaultDecks from "../data/defaultDecks";
import deckGradients from '../data/deckGradients.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  FaSortAmountDown, FaSearch, FaProjectDiagram, FaNetworkWired,
  FaCode, FaCogs, FaUsers, FaBook, FaTree, FaHeart, FaAppleAlt,
  FaFire, FaCloudSun, FaLeaf, FaWater, FaCrown, FaMagic, FaSeedling,
  FaShip, FaGem, FaSwimmer, FaPlane, FaStar, FaMedal, FaFish,FaCheckCircle,FaTrophy, FaChartLine, FaBullseye, FaCircle 
} from 'react-icons/fa';
import { MdMemory } from 'react-icons/md';
import { MdBlock } from 'react-icons/md';


import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);


function formatDate(dateString) {
  return format(new Date(dateString), 'dd/MM/yyyy');
}


function isValidEmail(email) {
  // Must contain '@' and end with '.com'
  return /^[^\s@]+@[^\s@]+\.com$/i.test(email);
}


// --- Utility: Bar color from red to green ---
function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}
function pctToColor(p) {
  if (p < 50) {
    const c = lerpColor([244, 67, 54], [255, 235, 59], p / 50);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  } else {
    const c = lerpColor([255, 235, 59], [46, 204, 64], (p - 50) / 50);
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
}

export default function Dashboard() {
  // Core state, tabs
  const [cards, setCards] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  // Popups/forms
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ question: "", answer: "", topic: "", deck: "" });
  const [newDeckName, setNewDeckName] = useState("");
  const [deckToDelete, setDeckToDelete] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  // Favourites/"done"/expand
  const [favIds, setFavIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("favIds_v1") || "[]")); } catch { return new Set(); }
  });
  const [doneIds, setDoneIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("doneIds_v1") || "[]")); } catch { return new Set(); }
  });
  const [expandedCardId, setExpandedCardId] = useState(null);
  // Auth/Profile
  const [showProfile, setShowProfile] = useState(false);
  const [profileMode, setProfileMode] = useState("login"); // 'login', 'register', 'profile'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("guest");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginStreak, setLoginStreak] = useState(1);
  const [guestBlockPopup, setGuestBlockPopup] = useState(false);

  const [showMilestone, setShowMilestone] = useState(false);

  const [doneHistory, setDoneHistory] = useState(() => {
  try { return JSON.parse(localStorage.getItem("doneHistory_v1") || "[]"); } catch { return []; }
});

const [doneByDeck, setDoneByDeck] = React.useState({
  science: new Set(['card1', 'card2']),
  math: new Set(),
  history: new Set(['card7']),
});

const [userLevel, setUserLevel] = useState(1);
const [popupCard, setPopupCard] = useState(null);
// State for daily MCQ modal visibility
const [showDailyMCQ, setShowDailyMCQ] = useState(false);

// State for daily MCQ question object: {date, question, options, correctAnswer, answered}
const [dailyMCQ, setDailyMCQ] = useState(() => {
  // Try to load from localStorage or create fresh
  const stored = localStorage.getItem("dailyMCQ");
  return stored ? JSON.parse(stored) : null;
});

// Streak count for daily MCQ participation
const [mcqStreak, setMcqStreak] = useState(() => {
  return Number(localStorage.getItem("mcqStreak")) || 0;
});


//most important
const apiUrl = process.env.REACT_APP_API_URL;


const deckIcons = {
  Sorting: <FaSortAmountDown />,
  Searching: <FaSearch />,
  "Dynamic Programming": <MdMemory />,
  Recursion: <FaProjectDiagram />,
  Graphs: <FaNetworkWired />,
  "Web Development": <FaCode />,
  "System Design": <FaCogs />,
  Behavioral: <FaUsers />,
  "Arrays & Strings": <FaBook />,
  "Trees & Binary Trees": <FaTree />,
  "Hashing": <FaAppleAlt />,
  "Bit Manipulation": <FaFire />,
  "Databases & SQL": <FaCloudSun />,
  "Concurrency & Multithreading": <FaLeaf />,
  "Advanced Math": <FaGem />,
  "Machine Learning": <FaMagic />,
  "Operating Systems": <FaCrown />,
  "Networking": <FaWater />,
  "Miscellaneous": <FaStar />,
};

const deckGradients = {
  Sorting: "linear-gradient(120deg, #b082d0 0%, #543881 100%)",                // grape violet → indigo
  Searching: "linear-gradient(120deg, #98cdfd 0%, #293a74 100%)",              // sky blue → dark blue
  "Dynamic Programming": "linear-gradient(120deg, #a4fbc4 0%, #14912d 100%)",  // mint → emerald
  Recursion: "linear-gradient(120deg, #e26f99 0%, #8d1d46 100%)",              // pink → dark rose
  Graphs: "linear-gradient(120deg, #7ee1df 0%, #157b7a 100%)",                 // aqua/teal
  "Web Development": "linear-gradient(120deg, #ffe495 0%, #db9902 100%)",      // gold
  "System Design": "linear-gradient(120deg, #e2c4fc 0%, #6c2a85 100%)",        // lavender → deep purple
  Behavioral: "linear-gradient(120deg, #ffd5c0 0%, #db7268 100%)",             // peach/coral
  "Arrays & Strings": "linear-gradient(120deg, #6d8ee1 0%, #1c3b8b 100%)",     // light blue → dark blue
  "Trees & Binary Trees": "linear-gradient(120deg, #7bd591 0%, #297749 100%)", // moss → forest green
  "Hashing": "linear-gradient(120deg, #ffe495 0%, #db9902 100%)",              // gold
  "Bit Manipulation": "linear-gradient(120deg, #d97c4b 0%, #7b3432 100%)",     // rust → brick
  "Databases & SQL": "linear-gradient(120deg, #dc7c99 0%, #803459 100%)",      // rose → plum
  "Concurrency & Multithreading": "linear-gradient(120deg, #a4fbc4 0%, #14912d 100%)", // mint → green
  "Advanced Math": "linear-gradient(120deg, #b082d0 0%, #543881 100%)",        // grape violet → indigo
  "Machine Learning": "linear-gradient(120deg, #ffe495 0%, #db9902 100%)",     // gold
  "Operating Systems": "linear-gradient(120deg, #dfbb60 0%, #9b650d 100%)",    // warm gold → bronze
  "Networking": "linear-gradient(120deg, #48b6e8 0%, #175e80 100%)",           // cerulean → steel blue
  "Miscellaneous": "linear-gradient(120deg, #b082d0 0%, #543881 100%)",        // violet → indigo
  // ...add more as needed for custom decks
};
const defaultCardGradient = "linear-gradient(120deg, #dc7c99 0%, #803459 100%)";

const deckGlows = {
  Sorting: "0 0 18px 4px #b082d08c",              // warm grape orange
  Searching: "0 0 18px 3px #6d8ee199",            // sky blue
  "Dynamic Programming": "0 0 20px 4px #43cea299",// mint green
  Recursion: "0 0 18px 4px #e26f9977",            // pink rose
  Graphs: "0 0 18px 4px #48b6e89c",               // aqua teal
  "Web Development": "0 0 18px 4px #ffd3607e",    // gold
  "System Design": "0 0 18px 4px #b082d08c",      // lavender grape
  Behavioral: "0 0 18px 4px #dc7c998a",           // coral rose

  "Arrays & Strings": "0 0 18px 3px #6d8ee199",    // light blue glow (matching gradient dark)
  "Trees & Binary Trees": "0 0 18px 4px #2977499a",// forest green glow
  Hashing: "0 0 18px 4px #ffd3607e",               // gold glow (reuse)
  "Bit Manipulation": "0 0 18px 4px #7b343299",   // dark brick glow
  "Databases & SQL": "0 0 18px 4px #8034599a",     // deep plum glow
  "Concurrency & Multithreading": "0 0 20px 4px #43cea299", // mint green
  "Advanced Math": "0 0 18px 4px #b082d08c",       // grape violet
  "Machine Learning": "0 0 18px 4px #ffd3607e",    // gold glow
  "Operating Systems": "0 0 18px 4px #9b650d8a",   // warm bronze glow
  Networking: "0 0 18px 4px #175e8099",             // steel blue glow
  Miscellaneous: "0 0 18px 4px #5438819a",          // indigo glow
  default: "0 0 18px 4px #a67ff7a2",
};

const defaultCardGlow="0 0 18px 4px #a67ff7a2";

const deckAccentColors = {
  Sorting: "#b082d08c",
  Searching: "#6d8ee199",
  "Dynamic Programming": "#43cea299",
  Recursion: "#e26f9977",
  Graphs: "#48b6e89c",
  "Web Development": "#ffd3607e",
  "System Design": "#b082d08c",
  Behavioral: "#dc7c998a",

  "Arrays & Strings": "#6d8ee199",               // light blue deep
  "Trees & Binary Trees": "#2977499a",           // forest green
  Hashing: "#ffd3607e",                           // gold
  "Bit Manipulation": "#7b343299",                // brick red
  "Databases & SQL": "#8034599a",                 // deep plum
  "Concurrency & Multithreading": "#43cea299",   // mint green
  "Advanced Math": "#b082d08c",                    // grape violet
  "Machine Learning": "#ffd3607e",                 // gold
  "Operating Systems": "#9b650d8a",                // bronze
  Networking: "#175e8099",                         // steel blue
  Miscellaneous: "#5438819a"                       // indigo
};



function generateDailyMCQ() {
  const allCards = defaultDecks.flatMap(deck => deck.cards);
  const questionCard = allCards[Math.floor(Math.random() * allCards.length)];

  // Collect unique possible answers
  let options = [questionCard.answer];
  while (options.length < 4) {
    const randomAnswer = allCards[Math.floor(Math.random() * allCards.length)].answer;
    if (!options.includes(randomAnswer)) options.push(randomAnswer);
  }
  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);

  const today = new Date().toISOString().slice(0, 10);

  return {
    date: today,
    question: questionCard.question,
    options,
    correctAnswer: questionCard.answer,
    answered: false,
    selectedOption: null,  // to track user choice
  };
}


useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);

  // Load dailyMCQ from localStorage
  const storedMCQ = JSON.parse(localStorage.getItem('dailyMCQ'));

  if (!storedMCQ || storedMCQ.date !== today) {
    // Generate or fetch a new MCQ for today
    const newDailyMCQ = generateDailyMCQ(); // your logic here or fetch from backend
    setDailyMCQ(newDailyMCQ);
    localStorage.setItem('dailyMCQ', JSON.stringify(newDailyMCQ));
  } else {
    setDailyMCQ(storedMCQ);
  }

  // Load streak similarly
  const storedStreak = Number(localStorage.getItem('mcqStreak')) || 0;
  setMcqStreak(storedStreak);
}, [userEmail]); // rerun when user switches or logs in/out



const handleMCQAnswer = (option) => {
  if (dailyMCQ.answered) return; // Prevent multiple answers

  const isCorrect = option === dailyMCQ.correctAnswer;

  // Mark as answered and store selected option
  const updatedMCQ = { ...dailyMCQ, answered: true, selectedOption: option };
  setDailyMCQ(updatedMCQ);
  localStorage.setItem("dailyMCQ", JSON.stringify(updatedMCQ));

  // Update streak; here we increment on any answer (correct or incorrect)
  const newStreak = mcqStreak + 1;
  setMcqStreak(newStreak);
  localStorage.setItem("mcqStreak", String(newStreak));
};

function DailyMCQCard({ dailyMCQ, onAnswer, onClose }) {
  if (!dailyMCQ) return null;

  const { question, options, answered, selectedOption, correctAnswer } = dailyMCQ;

  return (
    <div className="daily-mcq-card">
      {/* Optional Close Button */}
      {onClose && (
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close Daily MCQ"
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          &times;
        </button>
      )}

      {/* Question */}
      <h2>{question}</h2>

      {/* Options */}
      <div className="optionsContainer">
        {options.map((opt) => {
          let btnClass = '';
          if (answered) {
            if (opt === correctAnswer) {
              btnClass = 'answered-correct';
            } else if (opt === selectedOption) {
              btnClass = 'answered-selected-incorrect';
            } else {
              btnClass = 'answered-other';
            }
          }

          return (
            <button
              key={opt}
              disabled={answered}
              onClick={() => onAnswer(opt)}
              className={btnClass}
              aria-pressed={selectedOption === opt}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className={`feedbackMessage ${selectedOption === correctAnswer ? 'correct' : 'incorrect'}`}>
          {selectedOption === correctAnswer ? (
            <>
              Correct! <FaFire />
            </>
          ) : (
            <>Oops! The correct answer is: {correctAnswer}</>
          )}
        </div>
      )}
    </div>
  );
}




function handleCardComplete(deckId, cardId) {
  setDoneByDeck(prev => ({
    ...prev,
    [deckId]: new Set([...(prev[deckId] || []), cardId])
  }));
}
 // fallback color

const doneCountsByDeck = {};
for (const deckId in doneByDeck) {
  doneCountsByDeck[deckId] = doneByDeck[deckId].size;
}

const unlockedCountForDeck = (deckId) => 
  5 + Math.floor((doneCountsByDeck[deckId] || 0) / 2);

// Place this in the code block related to the selected deck
const cardsInSelectedDeck = cards.filter(c => c.deck === selectedDeck)
  .sort((a, b) => a.createdAt - b.createdAt || a._id.localeCompare(b._id));

const doneInDeck = cardsInSelectedDeck.filter(c => doneIds.has(c._id)).length;
// How many cards to show
const baseCount = 1;

; // Tune as you like

const fetchUserState = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${apiUrl}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // ✅ Set these to your state
    setFavIds(new Set(res.data.favourites || []));
    setDoneIds(new Set(res.data.doneCards.map(c => c.cardId)));
    setDoneHistory(res.data.doneCards || []);
    
  } catch (err) {
    console.error("Failed to fetch user state:", err);
  }
  
};

useEffect(() => {
  if (isLoggedIn && userRole === 'registered') {
    fetchUserState();
  }
}, [isLoggedIn]);




useEffect(() => {
  localStorage.setItem("doneHistory_v1", JSON.stringify(doneHistory));
}, [doneHistory]);


  // LocalStorage sync for favourites/done
  useEffect(() => { localStorage.setItem("favIds_v1", JSON.stringify(Array.from(favIds))); }, [favIds]);
  useEffect(() => { localStorage.setItem("doneIds_v1", JSON.stringify(Array.from(doneIds))); }, [doneIds]);

  // On mount: login as guest or user, seed streak
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "registered");
        setIsLoggedIn(decoded.role !== "guest");
        setUserEmail(decoded.email || "");
        fetchCards(decoded.role || "registered");
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem('mcqStreak');
        loginAsGuest();
      }
    } else {
      loginAsGuest();
    }
    // eslint-disable-next-line
  }, []);

  // Fetch cards: always show demo if guest, seed if registered & empty
  const fetchCards = async (providedRole) => {
    const role = providedRole || userRole;
    const token = localStorage.getItem("token");
    if (!token || role === "guest") {
      // Guest or no token: show demo decks
      const demoCards = [];
      defaultDecks.forEach(d => {
        d.cards.forEach((card, idx) => {
          demoCards.push({
            ...card, deck: d.deck, _id: `${d.deck}___${idx}` // dummy id
          });
        });
      });
      setCards(demoCards);
      setDecks(defaultDecks.map(d => d.deck));
      return;
    }
    try {
      const res = await axios.get(`${apiUrl}/api/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.length === 0 && role === "registered") {
        // Seed backend for registered user
      try{  for (const deck of defaultDecks) {
          for (const card of deck.cards) {
            await axios.post(`${apiUrl}/api/cards`, { ...card, deck: deck.deck, code: card.code || '', codeLanguage: card.codeLanguage || 'cpp' },
              { headers: { Authorization: `Bearer ${token}` } });
          }
        }
        await fetchCards('registered');
        return;
  } catch (e) {
    console.error('Error seeding default decks:', e);
    // Optionally handle error state
  }
  return;
      }
      setCards(res.data);
      
      setDecks(Array.from(new Set(res.data.map(c => c.deck))));
    } catch {
      // fallback to premade for guest on error
      const demoCards = [];
      defaultDecks.forEach(d => {
        d.cards.forEach((card, idx) => {
          demoCards.push({ ...card, deck: d.deck, _id: `${d.deck}___${idx}` });
        });
      });
      setCards(demoCards);
      setDecks(defaultDecks.map(d => d.deck));
    }
  };


 


  // --- Auth / register / logout logic ---
  const loginAsGuest = () => {
    console.log("Attempting guest login...");
  axios.post(`${apiUrl}/api/auth/guest`)
    .then(res => {
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUserRole("guest");
      setIsLoggedIn(false);
      setUserEmail("");
      fetchCards("guest");
    })
    .catch(() => {
      setUserRole("guest");
      setIsLoggedIn(false);
      setUserEmail("");
      fetchCards("guest");
    });
};



const handleLogin = async (e) => {
  e.preventDefault();
  setLoginError("");

   if (!isValidEmail(email)) {
    setLoginError("Email must contain '@' and end with '.com'");
    return;
  }

  try {
    const res = await axios.post(`${apiUrl}/api/auth/login`, {
      email,
      password
    });

    // ⬇️ store token and decode it
    const token = res.data.token;
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);

    setIsLoggedIn(true);
    setUserEmail(decoded.email || "");
    setUserRole(decoded.role || "registered");
    setProfileMode("profile");

    localStorage.removeItem("dailyMCQ");

    // ✅ Streak logic
    const today = new Date().toLocaleDateString();
    const last = localStorage.getItem("lastLoginDate");
    let streak = Number(localStorage.getItem("mcqStreak")) || 0;

    if (!last) streak = 1;
    else {
      const lastDate = new Date(last);
      const diffDays = (new Date(today) - lastDate) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) streak++;
      else if (diffDays !== 0) streak = 1;
    }

    localStorage.setItem("lastLoginDate", today);

    localStorage.setItem("mcqStreak", streak.toString());
  // This is important!


    fetchCards("registered");
  } catch (err) {
    setLoginError(err.response?.data?.error || "Invalid email or password.");
    localStorage.removeItem("token");
    setUserEmail("");
    setUserRole("guest");
    setIsLoggedIn(false);
    fetchCards("guest");
  }
};


 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("doneHistory_v1");
  localStorage.removeItem('mcqStreak');
  setDailyMCQ(null);
  localStorage.removeItem('dailyMCQ');
  setDoneHistory([]);
  setIsLoggedIn(false);
  setUserRole("guest");
  setUserEmail("");
  setShowProfile(false);
  setProfileMode("login");
  loginAsGuest();

  const newMCQ = generateDailyMCQ();  // your function
  setDailyMCQ(newMCQ);
  localStorage.setItem("dailyMCQ", JSON.stringify(newMCQ));

};

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");

    if (!isValidEmail(regEmail)) {
    setRegisterError("Email must contain '@' and end with '.com'");
    return;
  }

    try {
      await axios.post(`${apiUrl}/api/auth/register`, {
  email: regEmail,
  password: regPassword
}, {
  withCredentials: true
});

      setProfileMode("login");
      setEmail(regEmail);
      setPassword("");
      setRegEmail("");
      setRegPassword("");
      setRegisterError("");
      localStorage.removeItem('mcqStreak');
      localStorage.removeItem('dailyMCQ');
    } catch (err) {
      setRegisterError(err.response?.data?.error || "Unable to register. Please try again.");
    }
  };

  // --- Deck/card add/delete logic ---
  const handleAddDeck = async (e) => {
    e.preventDefault();
    if (userRole === "guest") return setGuestBlockPopup(true);
    const trimmed = newDeckName.trim();
    if (!trimmed) return;
    if (!decks.includes(trimmed)) setDecks([...decks, trimmed]);
    setShowAddDeck(false);
    setNewDeckName("");
  };
  const confirmDeleteDeck = (deck) => userRole === "guest" ? setGuestBlockPopup(true) : setDeckToDelete(deck);
  const handleDeleteDeck = async () => {
    if (userRole === "guest") return setGuestBlockPopup(true);
    const token = localStorage.getItem("token");
    for (let card of cards.filter(c => c.deck === deckToDelete)) {
      await axios.delete(`${apiUrl}/api/cards/${card._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    setDeckToDelete(null);
    fetchCards("registered");
  };
  const handleCardFormChange = (e) => setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (userRole === "guest") return setGuestBlockPopup(true);
    const token = localStorage.getItem("token");
    const data = { ...cardForm, deck: selectedDeck || cardForm.deck };
    if (!data.question || !data.answer || !data.topic || !data.deck) return alert("Please fill all fields.");
    await axios.post(`${apiUrl}/api/cards`, data, { headers: { Authorization: `Bearer ${token}` } });
    setCardForm({ question: "", answer: "", topic: "", deck: "" });
    setShowAddCard(false);
    fetchCards("registered");
  };
  const confirmDeleteCard = (id) => userRole === "guest" ? setGuestBlockPopup(true) : setCardToDelete(id);
  const handleDeleteCard = async () => {
    if (userRole === "guest") return setGuestBlockPopup(true);
    const token = localStorage.getItem("token");
    await axios.delete(`${apiUrl}/api/cards/${cardToDelete}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCardToDelete(null);
    fetchCards("registered");
  };

  // --- Bookmarks & done logic ---
  const handleBookmark = async (cardId) => {
  if (userRole === "guest") return setGuestBlockPopup(true);
  const updated = new Set(favIds);

  const isAdding = !updated.has(cardId);
  if (isAdding) updated.add(cardId);
  else updated.delete(cardId);

  setFavIds(updated);

  await axios.post(`${apiUrl}/api/user/favourites`, {
    cardId,
    action: isAdding ? 'add' : 'remove'
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
};



  
const handleDone = async (cardId) => {
  const authToken = localStorage.getItem("token");

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 3);

  const updatePayload = {
    nextReview: nextReviewDate.toISOString(),
    done: true,
  };

  const API_BASE_URL = `${apiUrl}`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to update card: ${res.status}\n${text}`);
    }

    const updatedCard = await res.json();

    // Update frontend cards state
    setCards(prev =>
      prev.map(card =>
        card._id === cardId ? { ...card, ...updatedCard } : card
      )
    );

    // ✅ Add to doneHistory for stats
    setDoneHistory(prev =>
      [...prev, { ts: Date.now(), cardId }]
    );

setDoneIds(prev => new Set([...prev, cardId]));

await axios.post(`${apiUrl}/api/user/done`, { cardId }, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});


  } catch (error) {
    console.error("Error updating card:", error);
    // Optional: display error UI
  }
};






  // --- Helpers for favourites/stats ---
  const favouriteDecks = decks.filter(deck => cards.some(card => card.deck === deck && favIds.has(card._id)));
  const favouriteCardsInDeck = deck => cards.filter(card => card.deck === deck && favIds.has(card._id));

  // --- Deck-wise stats ---
  const deckProgress = {};
  for (const deck of decks) {
    const cardsInThisDeck = cards.filter(c => c.deck === deck);
    const done = cardsInThisDeck.filter(c => doneIds.has(c._id)).length;
    deckProgress[deck] = {
      done, total: cardsInThisDeck.length,
      pct: cardsInThisDeck.length ? Math.round(done * 100 / cardsInThisDeck.length) : 0
    };
  }
 const sortedDeckCards = cards
  .filter(c => c.deck === selectedDeck)
  .sort((a, b) => a.createdAt - b.createdAt || a._id.localeCompare(b._id)); // consistent order

const totalCards = sortedDeckCards.length;
const unlockCountInDeck = Math.min(baseCount + doneInDeck, totalCards);

const unlockedCards = cardsInSelectedDeck.slice(0, unlockCountInDeck);
const lockedCards = cardsInSelectedDeck.slice(unlockCountInDeck);

  //stats calculcation------

  function getDayStart(ts) {
  // Midnight local time for timestamp
  const d = new Date(ts);
  d.setHours(0,0,0,0);
  return d.getTime();
}
const todayStart = getDayStart(Date.now());

const daysSpan = 14;
const dailyDoneCounts = Array.from({length: daysSpan}, (_, i) => {
  const dayTs = todayStart - (daysSpan-1-i) * 86400000;
  const count = doneHistory.filter(e => {
    const t = getDayStart(e.ts);
    return t === dayTs;
  }).length;
  return { dayTs, count };
});

// For "last week" and "prev week"
const lastWeekTotal = dailyDoneCounts.slice(-7).reduce((a,b) => a + b.count, 0);
const prevWeekTotal = dailyDoneCounts.slice(-14, -7).reduce((a,b) => a + b.count, 0);
const weekDiffPct = prevWeekTotal === 0 && lastWeekTotal > 0 ? 100
  : prevWeekTotal === 0 ? 0
  : Math.round(((lastWeekTotal-prevWeekTotal) / prevWeekTotal) * 100);

// Milestone for number of Done
const [milestoneText, setMilestoneText] = useState("");

useEffect(() => {
  const doneCount = doneIds.size;
   setUserLevel(Math.floor(doneCount / 10));
  // Trigger milestone popup only at multiples of 10
  if (doneCount > 0 && (doneCount % 10 === 0)) {
    setMilestoneText(`Great job! ${doneCount} cards completed!`);
  }
}, [doneIds]);


// Deck completion milestones
const completedDecks = decks.filter(deck => 
  deckProgress[deck] && deckProgress[deck].pct === 100 && deckProgress[deck].total > 0);

// Topic mastery bars
const topicStats = {};
cards.forEach(card => {
  if (!topicStats[card.topic]) topicStats[card.topic] = { total: 0, done: 0 };
  topicStats[card.topic].total += 1;
  if (doneIds.has(card._id)) topicStats[card.topic].done += 1;
});


// For last 14 days bar chart
const dateShort = ts => {
  const d = new Date(ts);
  return `${d.getMonth()+1}/${d.getDate()}`;
};

const dailyBarLabels = dailyDoneCounts.map(d =>
  new Date(d.dayTs).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
);

const dailyBarData = dailyDoneCounts.map(d => d.count);


const cutoffIndex = dailyBarData.length - 7;

const weeklyBarData = {
  labels: dailyBarLabels,
  datasets: [
    {
      label: "Cards Marked Done",
      data: dailyBarData,
      backgroundColor: dailyBarData.map((_, idx) =>
        idx >= cutoffIndex ? "#7cf57c" : "#fbbf2490"
      ),
      hoverBackgroundColor: dailyBarData.map((_, idx) =>
        idx >= cutoffIndex ? "#45ec48" : "#fde68a"
      ),
      borderRadius: 7,
      barPercentage: 0.7,
      categoryPercentage: 0.7,
    },
  ],
};




const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: {
      grid: {display: false},
      ticks: {color:"#adafaf", font:{ weight:'bold', size:12 }},
    },
    y: {
      grid: {color:"#36364a"},
      beginAtZero: true,
      ticks: {stepSize: 1, color:"#bfbecf"},
      min: 0
    }
  }
};



// Deck completion data for donut
const completedDecksCount = completedDecks.length;
const totalDecksCount = decks.length;

const donutData = {
  datasets: [{
    data: [
      completedDecksCount,
      Math.max(0, totalDecksCount - completedDecksCount)
    ],
    backgroundColor: [
      "#18fd60", // completed decks
      "#284e3d"  // incomplete
    ],
    borderWidth: 0,
    hoverBackgroundColor: [
      "#84ffb5",
      "#2a3a29"
    ]
  }],
  labels: ["Completed", "Remaining"]
};

const donutOptions = {
  cutout: "75%",
  radius: "90%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ctx =>
          ctx.label === "Completed"
            ? `${ctx.raw} completed`
            : `${ctx.raw} remaining`
      }
    },
  }
};




  // --- RENDER ---
  return (
    
    <div className="dashboard-container">
      {/* Header + Tabs */}
      <nav className="main-header">
        <div className="header-title">Recallit</div>
        <div className="header-links">
          <button className={`header-link${activeTab === "home" ? " active" : ""}`}
            onClick={() => { setSelectedDeck(null); setActiveTab("home"); }}>Home</button>
          <button className={`header-link${activeTab === "favourites" ? " active" : ""}`}
            onClick={() => { setSelectedDeck(null); setActiveTab("favourites"); }}>Favourites</button>
          <button className={`header-link${activeTab === "stats" ? " active" : ""}`}
            onClick={() => {
              if (userRole === "guest") setGuestBlockPopup(true);
              else { setSelectedDeck(null); setActiveTab("stats"); }
            }}>Stats</button>
            {/* ...existing nav links/buttons... */}
<button
  onClick={() => setShowDailyMCQ(true)}
  style={{
    background: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "1.7rem",
    color: "#ff9800",
    marginRight: "1rem",
  }}
  aria-label={`Daily MCQ Streak: ${mcqStreak} day${mcqStreak !== 1 ? "s" : ""}`}
  title={`Daily MCQ Streak: ${mcqStreak} day${mcqStreak !== 1 ? "s" : ""}`}
>
  <FaFire size={24} color="#ff9800" style={{ marginRight: 4 }} />
  <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{mcqStreak}</span>
</button>

          <button className="profile-btn"
            onClick={() => { setShowProfile(true); setProfileMode(isLoggedIn ? "profile" : "login"); }}>
            <svg viewBox="0 0 24 24" fill="none" width="26" height="26" stroke="#3a3e6a" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4.2" />
              <path d="M4.2 20a7.8 7.8 0 0 1 15.6 0" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="dashboard-inner">
        {activeTab === "home" && !selectedDeck && (
          userRole === "registered" ? (
            <div className="home-actions">
              <button className="add-btn" onClick={() => setShowAddDeck(true)}>Add Deck</button>
              <button className="add-btn" onClick={() => setShowAddCard(true)}>Add Card</button>
            </div>
          ) : (
            <div className="home-actions">
              <button className="add-btn" onClick={() => setGuestBlockPopup(true)}>Add Deck</button>
              <button className="add-btn" onClick={() => setGuestBlockPopup(true)}>Add Card</button>
            </div>
          )
        )}

        {showAddDeck && (
          <div className="overlay-popup">
            <div className="popup-content">
              <h3>Add New Deck</h3>
              <form onSubmit={handleAddDeck}>
                <input className="input-field" placeholder="Deck name"
                  value={newDeckName} onChange={e => setNewDeckName(e.target.value)} required />
                <div className="popup-actions">
                  <button className="save-btn" type="submit">Save Deck</button>
                  <button className="back-btn" type="button" onClick={() => setShowAddDeck(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddCard && (
          <div className="overlay-popup">
            <div className="popup-content">
              <h3>Add New Card</h3>
              <form onSubmit={handleAddCard}>
                <input className="input-field" placeholder="Question" name="question" value={cardForm.question} onChange={handleCardFormChange} required />
                <input className="input-field" placeholder="Answer" name="answer" value={cardForm.answer} onChange={handleCardFormChange} required />
                <input className="input-field" placeholder="Topic" name="topic" value={cardForm.topic} onChange={handleCardFormChange} required />
                {!selectedDeck && (
                  <div className="form-group">
                  <select className="input-field-option" name="deck" value={cardForm.deck} onChange={handleCardFormChange} required>
                    <option value="" >Select Deck...</option>
                    {decks.map(deck => (<option value={deck} key={deck}>{deck}</option>))}
                  </select>
                  </div>
                )}
                <div className="popup-actions">
                  <button className="save-btn" type="submit">Save Card</button>
                  <button className="back-btn" type="button" onClick={() => setShowAddCard(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="overlay-popup">
            <div className="popup-content">
              {profileMode === "login" && !isLoggedIn && (
                <form onSubmit={handleLogin}>
                  <h3>Login</h3>
                  <input className="input-field" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                  {loginError && <p className="error-text">{loginError}</p>}
                  <div className="popup-actions">
                    <button className="save-btn" type="submit">Login</button>
                    <button className="back-btn" type="button" onClick={() => setShowProfile(false)}>Cancel</button>
                  </div>
                  <p style={{ marginTop: "1em" }}>
                    Don't have an account?
                    <button className="link-btn" onClick={e => { e.preventDefault(); setProfileMode("register"); setLoginError(""); }} style={{fontFamily:"Product Sans"}}>Register</button>
                  </p>
                </form>
              )}
              {profileMode === "register" && (
                <form onSubmit={handleRegister}>
                  <h3>Register</h3>
                  <input className="input-field" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  <input className="input-field" placeholder="Password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                  {registerError && <p className="error-text">{registerError}</p>}
                  <div className="popup-actions">
                    <button className="save-btn" type="submit">Register</button>
                    <button className="back-btn" type="button" onClick={() => setShowProfile(false)}>Cancel</button>
                  </div>
                  <p style={{ marginTop: "1em" }}>
                    Already have an account?
                    <button className="link-btn" onClick={e => { e.preventDefault(); setProfileMode("login"); setRegisterError(""); }} style={{fontFamily:"Product Sans"}}>Login</button>
                  </p>
                </form>
              )}
              {profileMode === "profile" && isLoggedIn && (
                <div>
                  <h3>Profile</h3>
                  <p><b>Email:</b> {userEmail || "No email"}</p>
                  <p><b>Level:</b> {userLevel}</p> 
                  <div className="popup-actions">
                  <button className="save-btn" onClick={handleLogout}>Logout</button>
                  <button className="back-btn" onClick={() => setShowProfile(false)}>Close</button>
                  </div>
                  </div>
              )}
            </div>
          </div>
        )}

        {/* TABS */}
        {/* Home Tab */}
        {activeTab === "home" && (
  !selectedDeck ? (
    <div>
      <h2>Your Decks</h2>
      <div className="deck-grid">
        {decks.length === 0 ? (
          <div className="deck-empty-text">No decks yet. Add one!</div>
        ) : (
          decks.map(deck => {
            const pct = deckProgress[deck]?.pct ?? 0;

            return (
              <div
                key={deck}
                className="deck-card-fixed"
                onClick={() => setSelectedDeck(deck)}
                style={{
                  background: deckGradients[deck] || defaultCardGradient,
                  '--card-glow-hover': deckGlows[deck] || defaultCardGlow, // per deck
                }}
              >
                <span className="deck-card-icon" aria-label={`${deck} icon`}>
                  {deckIcons[deck] || <FaCode />} {/* Fallback icon */}
                </span>

                <div className="deck-name-container">
                  <span className="deck-name">{deck}</span>
                </div>

                <div className="card-bottom">
                  <div className="deck-progress-text">{pct + '% Complete'}</div>
                  <div className="deck-progress-bar">
                    <div
                      className="deck-progress-bar-fill"
                      style={{ width: pct + '%', backgroundColor: pctToColor(pct) }}
                    />
                  </div>
                </div>

                {userRole === "registered" && (
                  <button
                    className="deck-delete-x"
                    onClick={e => { e.stopPropagation(); confirmDeleteDeck(deck); }}
                    title="Delete deck"
                  >
                    &#x2716;
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {userRole === "guest" && (
        <p className="guest-info-text">
          <MdBlock className="icon-header-align" /> Guests cannot add or modify decks/cards. Please log in for full features!
        </p>
      )}
    </div>
  )  : (
            // Home > Cards in selected deck
            <>
              <button className="back-btn" style={{ marginTop: "1rem" }} onClick={() => setSelectedDeck(null)}>&larr; Back to decks</button>
              <h2 className="deck-title" style={{ marginTop: ".9rem" }}>{selectedDeck} Deck</h2>
              {userRole === "registered" && (
                <div className="home-actions">
                <button className="add-btn" style={{ marginBottom: "2rem" }} onClick={() => setShowAddCard(true)}>Add Card</button>
                </div>
              )}
              
              <div className="card-grid-fixed">
  {sortedDeckCards.length === 0 ? (
    <div className="deck-empty-text">No cards in this deck.</div>
  ) : (
    [...unlockedCards, ...lockedCards].map((card, idx) => {
      const isLocked = idx >= unlockCountInDeck;
      const expanded = expandedCardId === card._id;

      return (
        <div
          key={card._id}
          className="card-fixed"
        style={{
    "--accent-color": deckAccentColors[card.deck] || "#a67ff7" // fallback color
  }}
>
  <svg
    className="card-accent-svg"
    viewBox="0 0 400 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    style={{}}
  >
    {/* Replace path as desired for different effects. Sample: wavy */}
    <path
      d="M0,60 Q120,100 200,50 Q300,10 400,60 L400,0 L0,0 Z"
      fill="var(--accent-color)"
      opacity="0.16"
    />
  </svg>

          {/* ✅ Bookmark icon (if registered, and not locked) */}
          {userRole === "registered" && !isLocked && (
  <span
        onClick={() =>
          userRole === "guest"
            ? setGuestBlockPopup(true)
            : handleBookmark(card._id)
        }
        className={`bookmark-icon${favIds.has(card._id) ? " bookmarked" : ""}`}
        title="Bookmark"
  >
    <svg
      viewBox="0 0 24 24"
      fill={favIds.has(card._id) ? "#ffd700" : "none"}
      stroke={favIds.has(card._id) ? "#ffd700" : "#888"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24 }}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  </span>
)}


          {/* ✅ Card header */}
          <div className="card-header">
            <h3 className="card-topic">{card.topic}</h3>
            <div className="card-deck">{card.deck}</div>
          </div>

          {/* ✅ Card content */}
          <div className="card-content">
            {isLocked ? (
              <div
                className="locked-msg"
                style={{
                  textAlign: "center",
                  padding: "1em",
                  color: "#888",
                  fontSize: "1em",
                }}
              >
                🔒 Locked — complete more cards to unlock!
              </div>
            ) : (
              <div className="qa-scroll-container">
                <p>
                  <strong>Q:</strong> {card.question}
                </p>
                <p>
                  <strong>A:</strong> {card.answer}
                </p>
                {card.code && (
              <button className="show-code-btn"
                onClick={() => setPopupCard(card)}
              >
                Show Code
              </button>
            )}
              </div>
            )}
          </div>

          

          {/* ✅ Actions only if unlocked */}
          {!isLocked && (
            
            <div className="card-footer">
              <span>
                Review: {card.nextReview ? formatDate(card.nextReview) : "-"}
              </span>
              {userRole === "registered" ? (
                <>
                 <button
  className="done-btn"
  disabled={doneIds.has(card._id)}
  onClick={() => handleDone(card._id)}
  
>
  Done
</button>

                  <button
                    className="delete-btn"
                    onClick={() => confirmDeleteCard(card._id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="done-btn"
                    onClick={() => setGuestBlockPopup(true)}
                  >
                    Done
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => setGuestBlockPopup(true)}
                  >
                    Delete
                  </button>
                  
                </>
              )}
            </div>
          )}

        </div>
      );
    })
  )}
</div>
{popupCard && (
  <div className="overlay-popup" onClick={() => setPopupCard(null)}>
    
    <div className="code-popup-content" onClick={e => e.stopPropagation()}>
      <h1 >C++</h1>
      <button className="close-btn" onClick={() => setPopupCard(null)}>&times;</button>
      <SyntaxHighlighter language={popupCard.codeLanguage || "cpp"} style={okaidia} customStyle={{ borderRadius: "14px", padding: "1em",  boxSizing: "border-box", overflow: "auto",background:"#1d1d1dff "}} className="responsive-code-block">
        {popupCard.code}
      </SyntaxHighlighter>
    </div>
  </div>
)}


            </>
          )
        )}

        {/* Favourites Tab */}
        {activeTab === "favourites" && (
          !selectedDeck ? (
            <div>
              <h2>Your Favourite Decks</h2>
              <div className="deck-grid">
                {favouriteDecks.length === 0 ? (
                  <div className="deck-empty-text">No favourites yet.</div>
                ) : (
                  favouriteDecks.map(deck => {
  const pct = deckProgress[deck]?.pct ?? 0;

  return (
    <div
      key={deck}
      className="deck-card-fixed"
      onClick={() => setSelectedDeck(deck)}
      style={{
        background: deckGradients[deck] || defaultCardGradient,
        '--card-glow-hover': deckGlows[deck], // per deck
      }}
    >
      <span className="deck-card-icon" aria-label={`${deck} icon`}>
        {deckIcons[deck] || <FaCode />} {/* Fallback icon */}
      </span>

      <div className="deck-name-container">
        <span className="deck-name">{deck}</span>
      </div>

      <div className="card-bottom">
        <div className="deck-progress-text">{pct + '% Complete'}</div>
        <div className="deck-progress-bar">
          <div
            className="deck-progress-bar-fill"
            style={{ width: pct + '%', backgroundColor: pctToColor(pct) }}
          />
        </div>
      </div>
    </div>
  );
})

                )}
              </div>
            </div>
          ) : (
            <>
              <button className="back-btn" style={{ marginTop: "1rem" }} onClick={() => setSelectedDeck(null)}>&larr; Back to decks</button>
              <h2 className="deck-title" style={{ marginTop: ".9rem" }}>{selectedDeck} (Favourites)</h2>
              <div className="card-grid-fixed">
                {favouriteCardsInDeck(selectedDeck).length === 0 ? (
                  <div className="deck-empty-text">No favourited cards in this deck.</div>
                ) : (
                  favouriteCardsInDeck(selectedDeck).map(card => {
                    //const qTooLong = card.question.length > 200;
                    //const aTooLong = card.answer.length > 300;
                    const expanded = expandedCardId === card._id;
                    return (
                      <div
          key={card._id}
          className="card-fixed"
        style={{
    "--accent-color": deckAccentColors[card.deck] || "#a67ff7" // fallback color
  }}
>
  <svg
    className="card-accent-svg"
    viewBox="0 0 400 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    style={{}}
  >
    {/* Replace path as desired for different effects. Sample: wavy */}
    <path
      d="M0,60 Q120,100 200,50 Q300,10 400,60 L400,0 L0,0 Z"
      fill="var(--accent-color)"
      opacity="0.16"
    />
  </svg>
                        <span
                          onClick={() => userRole === "guest"
                            ? setGuestBlockPopup(true)
                            : handleBookmark(card._id)}
                          className={`bookmark-icon${favIds.has(card._id) ? " bookmarked" : ""}`} title="Bookmark"
                        >
                          <svg viewBox="0 0 24 24" fill={favIds.has(card._id) ? "#ffd700" : "none"} stroke={favIds.has(card._id) ? "#ffd700" : "#888"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        </span>
                        <div className="card-header">
                          <h3 className="card-topic">{card.topic}</h3>
                          <span className="card-deck">{card.deck}</span>
                        </div>
                        <div className="card-content">
                          <div className="qa-scroll-container">
  <p><strong>Q:</strong> {card.question}</p>
  <p><strong>A:</strong> {card.answer}</p>
  { card.code && (
              <button className="show-code-btn"
                onClick={() => setPopupCard(card)}
              >
                Show Code
              </button>
            )}
  </div>
                        </div>
                        <div className="card-footer">
                          <span>Review: {card.nextReview ? new Date(card.nextReview).toLocaleDateString() : "-"}</span>
                          {userRole === "registered" ? (
                            <>
                              <button
  className="done-btn"
  disabled={doneIds.has(card._id)}
  onClick={() => handleDone(card._id)}
>
  Done
</button>
                              <button className="delete-btn" onClick={() => confirmDeleteCard(card._id)}>Delete</button>
              
                            </>
                          ) : (
                            <>
                              <button className="done-btn" onClick={() => setGuestBlockPopup(true)}>Done</button>
                              <button className="delete-btn" onClick={() => setGuestBlockPopup(true)}>Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )
        )}

        {/* Stats Tab */}
        
{activeTab === "stats" && (
  <div className="lcstats-dashboard">
    <div className="lcstats-row">
      {/* Streak & Milestones, with centered donut */}
      <div className="lcstats-card lcstats-card-tall">
        <h3 className="lcstats-h"><FaMedal className="icon-header-align" style={{}} /> Streak & Milestones</h3>
        <div className="lcstats-center-flex-col">
          <div className="lcstats-donut-container">
            <Doughnut data={donutData} options={donutOptions} width={120} height={120}/>
            <div className="lcstats-donut-overlay">
              <span className="lcstats-donut-num">{completedDecksCount}</span>
              <span className="lcstats-donut-txt">of {totalDecksCount} </span>
            </div>
          </div>
          <div className="lcstats-below-donut">
            <span className="lcstats-badge streak">
              Streak: <b>{mcqStreak}</b> day{mcqStreak!==0?"s":""} <FaFire style={{marginLeft: 4, verticalAlign: 'middle', color:'#fff'}} />
            </span>
            {milestoneText && (
              <span className="lcstats-badge milestone">{milestoneText}</span>
            )}
            {completedDecks.length > 0 && (
              <span className="lcstats-badge completed">
                Completed: <b>{completedDecks.join(", ")}</b> <FaCheckCircle style={{marginLeft: 4, verticalAlign: 'middle', color:'#fff'}} />
              </span>
            )}      
          </div>
        </div>
      </div>
      {/* Activity Bar Chart */}
      <div className="lcstats-card lcstats-card-tall">
        <h3 className="lcstats-h"><FaChartLine className="icon-header-align" />Activity (14 days)</h3>
        <div className="lcstats-bar-container">
 <Bar
  key={JSON.stringify(weeklyBarData)}  // force redraw when data changes
  data={weeklyBarData}
  options={barOptions}
  height={110}
/>
</div>
        <div className="lcstats-activity-footer">
          <span>{lastWeekTotal} this week</span>
          <span
            className={
              weekDiffPct > 0 ? "lcstats-arrow-up"
              : weekDiffPct < 0 ? "lcstats-arrow-down"
              : ""
            }
            style={{
              marginLeft: 12,
              color: weekDiffPct > 0 ? "#2ecc40"
               : weekDiffPct < 0 ? "#ff5c5c"
               : "#fffbe1"
            }}>
            {weekDiffPct > 0 ? "▲" : weekDiffPct < 0 ? "▼" : ""}
            {Math.abs(weekDiffPct)}%
          </span>
          <span className="stats-vs">vs last week</span>
        </div>
      </div>
    </div>
    <div className="lcstats-row">
      {/* Deck Progress */}
      <div className="lcstats-card lcstats-card-tall">
        <h3 className="lcstats-h"><FaBook className="icon-header-align" /> Deck Progress</h3>
        <div className="lcstats-scroll-list">
          {decks.length === 0 ? (
            <div className="deck-empty-text">No decks yet.</div>
          ) : (
            decks.map(deck => {
              const pct = deckProgress[deck].pct ?? 0;
              return (
                <div key={deck} className="lcstats-prow">
                  <span className="lcstats-prow-label">{deck}</span>
                  <div className="lcstats-prow-barbg">
                    <div
                      className="lcstats-prow-barfill"
                      style={{width: `${pct}%`, background: pctToColor(pct)}}
                    />
                  </div>
                  <span className="lcstats-prow-pct">{pct}%</span>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Topic Mastery */}
      <div className="lcstats-card lcstats-card-tall">
        <h3 className="lcstats-h"><FaBullseye className="icon-header-align" /> Topic Mastery</h3>
        <div className="lcstats-scroll-list">
          {Object.keys(topicStats).length > 0 ? (
            Object.entries(topicStats).sort(([a], [b]) => a.localeCompare(b))
              .map(([topic, tstat]) => {
                const pct = tstat.total ? Math.round((tstat.done/tstat.total)*100) : 0;
                return (
                  <div key={topic} className="lcstats-prow">
                    <span className="lcstats-prow-label">{topic}</span>
                    <div className="lcstats-prow-barbg">
                      <div
                        className="lcstats-prow-barfill"
                        style={{
                          width: `${pct}%`,backgroundColor:pctToColor(pct)
                        }}
                      />
                    </div>
                    <span className="lcstats-prow-pct">{pct}%</span>
                  </div>
                );
              })
          ) : (
            <div className="deck-empty-text">No topics yet.</div>
          )}
        </div>
      </div>
    </div>
  </div>
)}
{milestoneText && (
  <div className="levelup-popup">
    <div className="levelup-content">
      <h2><FaTrophy className="icon-header-align" /> Level Up!</h2>
      <p>{milestoneText}</p>
      <button className="save-btn" onClick={() => setMilestoneText("")}>Nice!</button>
    </div>
  </div>
)}



      </div>

      {/* DELETE dialogs */}
      {deckToDelete && (
        <div className="overlay-popup">
          <div className="popup-content">
            <p>Delete <b>{deckToDelete}</b> and all its cards?</p>
            <button className="save-btn" onClick={handleDeleteDeck}>Yes, delete</button>
            <button className="back-btn" style={{ marginLeft: "1em" }} onClick={() => setDeckToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}
      {cardToDelete && (
        <div className="overlay-popup">
          <div className="popup-content">
            <p>Delete this card?</p>
            <button className="save-btn" onClick={handleDeleteCard}>Yes, delete</button>
            <button className="back-btn" style={{ marginLeft: "1em" }} onClick={() => setCardToDelete(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Block popup for guest actions */}
      {guestBlockPopup && (
        <div className="overlay-popup">
          <div className="popup-content" style={{ maxWidth: 350, textAlign: "center" }}>
            <div style={{ fontSize: "2.2em", marginBottom: ".6em" }}><MdBlock className="icon-header-align" style={{marginLeft:"0.3em"}} /></div>
            <div style={{ fontWeight: 600, fontSize: "1.08em", marginBottom: "2em" }}>
              Please register or login to use this feature!
            </div>
            <button
              className="save-btn"
              onClick={() => setGuestBlockPopup(false)}
            >Okay</button>
          </div>
        </div>
      )}

      {showDailyMCQ && dailyMCQ && (
  <div
    className="overlay-popup"
    onClick={() => setShowDailyMCQ(false)}
  >
    <div className="code-popup-content" onClick={e => e.stopPropagation()}>
      {/* Optional header */}
      <h1>Daily MCQ</h1>

      {/* Close Button */}
      <button className="close-btn" onClick={() => setShowDailyMCQ(false)}>&times;</button>

      {/* Your DailyMCQCard or inline MCQ content */}
      <DailyMCQCard
        dailyMCQ={dailyMCQ}
        onAnswer={handleMCQAnswer}
      />
    </div>
  </div>
)}

      
    </div>
  );
}
