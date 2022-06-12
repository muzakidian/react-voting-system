import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Component
import Ranking from './Ranking';
import Ballot from './Ballot';

const Home = ({ db, firebase, candidates, user, setUser }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votes, setVotes] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const userCollectionRef = collection(db, 'users');

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);

      let votes = [];
      data.docs.map((_doc) => {
        const doc = _doc.data();
        if (doc.candidates) {
          if (doc.candidates.presidential) {
            const idx = votes.findIndex(
              (c) => c?.id === doc.candidates.presidential
            );

            if (idx !== -1) {
              votes[idx].counts++;
            } else {
              votes = [
                ...votes,
                {
                  id: doc.candidates.presidential,
                  counts: 1,
                },
              ];
            }
          }

          if (doc.candidates.vicepresidential) {
            const idx = votes.findIndex(
              (c) => c?.id === doc.candidates.vicepresidential
            );

            if (idx !== -1) {
              votes[idx].counts++;
            } else {
              votes = [
                ...votes,
                {
                  id: doc.candidates.vicepresidential,
                  counts: 1,
                },
              ];
            }
          }
        }
      });

      setVotes(votes);
    };

    getUsers();
  }, []);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if (!user) window.location.assign('/');
        else setUser(user?.providerData[0]);
      });

    // Make sure we un-register Firebase observers when the component unmounts.
    return () => unregisterAuthObserver();
  }, []);

  const handleOnSelectCandidate = (data) => {
    setSelectedCandidate({
      ...selectedCandidate,
      candidates: {
        ...selectedCandidate?.candidates,
        [data.name]: data.id,
      },
      userInfo: {
        name: user.displayName,
        email: user.email,
      },
    });
  };

  const handleOnVote = async () => {
    await addDoc(userCollectionRef, { ...selectedCandidate }).then(() => {
      setSelectedCandidate(null);
      window.alert('Thank you for voting!');
      window.location.reload();
    });
  };

  const handleSingOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.assign('/');
      });
  };

  return (
    <section>
      <ul className="btn-group">
        <li
          className={['btn', activeTab === 1 ? 'active' : ''].join(' ')}
          onClick={() => setActiveTab(1)}
        >
          Ranking
        </li>
        <li
          className={['btn', activeTab === 2 ? 'active' : ''].join(' ')}
          onClick={() => setActiveTab(2)}
        >
          Vote!
        </li>
      </ul>
      <div className="container">
        {activeTab === 1 ? (
          <Ranking votes={votes} candidates={candidates} />
        ) : (
          <Ballot
            candidates={candidates}
            selectedCandidate={selectedCandidate}
            onClick={handleOnSelectCandidate}
          />
        )}

        <div className="footer">
          {activeTab === 2 && (
            <button className="vote" onClick={handleOnVote}>
              Vote
            </button>
          )}
          <button className="singout" onClick={handleSingOut}>
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
