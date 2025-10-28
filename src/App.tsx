import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CareExperience from "./components/CareExperience";
import Display from "./components/Display";

function App() {
    return (
        <Router>
            <Routes>
                {/* Remote Control Page */}
                <Route path="/" element={
                    <div style={{ width: "100vw", height: "100vh", background: "#222" }}>
                        <CareExperience />
                    </div>
                } />
                
                {/* Display Page */}
                <Route path="/display" element={<Display />} />
            </Routes>
        </Router>
    );
}

export default App;
