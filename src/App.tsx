import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router";
import WeddingInvitation from "./components/WeddingInvitation.tsx";
import WeddingMusic from "./components/WeddingMusic.tsx";
import {Thankful} from "./components/Thankful.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="" element={<WeddingMusic />} />
                    <Route path="/home" element={<WeddingInvitation />} />
                    <Route path="/thankful" element={<Thankful />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;