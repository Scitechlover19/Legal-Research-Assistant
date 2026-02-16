// import React, { useState, useEffect } from 'react';
// import './Home.css';
// // import logo from './images/logo.png';

// const Home = () => {
//   const [problemInput, setProblemInput] = useState('');
//   const [legalCharges, setLegalCharges] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [recognition, setRecognition] = useState(null);
//   const [offset, setOffset] = useState(0);

//   useEffect(() => {
//     // Initialize speech recognition if supported
//     if (window.webkitSpeechRecognition) {
//       const recognitionInstance = new window.webkitSpeechRecognition();
//       recognitionInstance.continuous = true;
//       recognitionInstance.interimResults = true;

//       recognitionInstance.onresult = (event) => {
//         const transcript = Array.from(event.results)
//           .map(result => result[0])
//           .map(result => result.transcript)
//           .join('');
//         setProblemInput(transcript);
//       };

//       recognitionInstance.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };

//       setRecognition(recognitionInstance);
//     }
//   }, []);

//   useEffect(() => {
//     // Background gradient animation
//     const intervalId = setInterval(() => {
//       setOffset((prevOffset) => (prevOffset + 1) % 360);
//     }, 50);
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleStartSpeechRecognition = () => {
//     if (recognition) {
//       if (!isListening) {
//         recognition.start();
//         setIsListening(true);
//       } else {
//         recognition.stop();
//         setIsListening(false);
//       }
//     } else {
//       alert('Speech recognition is not supported in your browser');
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Simulate processing the legal problem
//     setLegalCharges(`Legal Charges for: ${problemInput}\n\nThis would contain the calculated legal charges based on the problem description.`);
//   };

//   const handleLogout = () => {
//     window.location.href = 'index.html';
//   };

//   return (
//     <div className="home-container" style={{ '--gradient-offset': `${offset}deg` }}>
//       <nav className="navbar">
//         <div className="logo">
          
//           <h1> ⚖️ LEGAL RESEARCH ASSISTANT</h1>
//         </div>
//         <div className="nav-links">
//           <a href="#services">Services</a>
//           <a href="#about">About</a>
//           <a href="#contact">Contact</a>
//           <button onClick={handleLogout} className="logout-button">Logout</button>
//         </div>
//       </nav>

//       <main className="main-content">
//         <section className="hero-section">
//           <h2>Your Legal Research Assistant</h2>
//           <p>Simplifying legal research through advanced technology</p>
//         </section>

//         <section className="problem-input-section">
//           <h3>Describe Your Legal Problem</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="input-container">
//               <textarea
//                 value={problemInput}
//                 onChange={(e) => setProblemInput(e.target.value)}
//                 placeholder="Provide a detailed description of your legal issue..."
//                 rows="8"
//               />
//               <div className="button-group">
//                 <button type="submit" className="submit-button">SUBMIT</button>
//                 <button
//                   type="button"
//                   onClick={handleStartSpeechRecognition}
//                   className={`speech-button ${isListening ? 'listening' : ''}`}
//                 >
//                   {isListening ? 'Stop Recognition' : 'Start Speech Recognition'}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </section>

//         {legalCharges && (
//           <section className="legal-charges-section">
//             <h3>Legal Charges</h3>
//             <div className="legal-charges-output">
//               {legalCharges}
//             </div>
//           </section>
//         )}
//       </main>

//       <footer className="footer">
//         <div className="disclaimer">
//           Disclaimer: The Legal Research Assistant platform is designed to assist with legal research 
//           and does not provide legal advice. For specific legal guidance or representation, 
//           please consult a licensed attorney.
//         </div>
//         <div className="copyright">
//           © 2024 Legal Research Assistant. All Rights Reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Home;
import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [problemInput, setProblemInput] = useState('');
  const [legalCharges, setLegalCharges] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Initialize speech recognition if supported
    if (window.webkitSpeechRecognition) {
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setProblemInput(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    // Background gradient animation
    const intervalId = setInterval(() => {
      setOffset((prevOffset) => (prevOffset + 1) % 360);
    }, 50);
    return () => clearInterval(intervalId);
  }, []);

  const handleStartSpeechRecognition = () => {
    if (recognition) {
      if (!isListening) {
        recognition.start();
        setIsListening(true);
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to the backend to get legal charges
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: problemInput }),
      });
      const data = await response.json();
      if (data.success) {
        setLegalCharges(data.message);
      } else {
        setLegalCharges(data.message);
      }
    } catch (error) {
      console.error('Error fetching legal charges:', error);
    }
  };

  const handleLogout = () => {
    window.location.href = 'index.html';
  };

  return (
    <div className="home-container" style={{ '--gradient-offset': `${offset}deg` }}>
      <nav className="navbar">
        <div className="logo">
          <h1> ⚖️ LEGAL RESEARCH ASSISTANT</h1>
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <section className="hero-section">
          <h2>Your Legal Research Assistant</h2>
          <p>Simplifying legal research through advanced technology</p>
        </section>

        <section className="problem-input-section">
          <h3>Describe Your Legal Problem</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <textarea
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="Provide a detailed description of your legal issue..."
                rows="8"
              />
              <div className="button-group">
                <button type="submit" className="submit-button">SUBMIT</button>
                <button
                  type="button"
                  onClick={handleStartSpeechRecognition}
                  className={`speech-button ${isListening ? 'listening' : ''}`}
                >
                  {isListening ? 'Stop Recognition' : 'Start Speech Recognition'}
                </button>
              </div>
            </div>
          </form>
        </section>

        {legalCharges && (
          <section className="legal-charges-section">
            <h3>Legal Charges</h3>
            <div className="legal-charges-output">
              {legalCharges}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="disclaimer">
          Disclaimer: The Legal Research Assistant platform is designed to assist with legal research 
          and does not provide legal advice. For specific legal guidance or representation, 
          please consult a licensed attorney.
        </div>
        <div className="copyright">
          2024 Legal Research Assistant. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;