// CodingExamInterface.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import './CodingExamInterface.css';

function fetchStandardDOM() {
  const answerElement = document.getElementById("answer-holder");
  return answerElement ? `${answerElement.dataset.answer}` : "";
}

function getUserDOM() {
  const outputContainer = document.getElementById("output");
  return outputContainer ? outputContainer.outerHTML : "";
}

function calculateDOMMatchPercentage(userDOMString, standardDOMString) {
  const parser = new DOMParser();
  const userDOM = parser.parseFromString(userDOMString, "text/html").body.firstChild;
  const standardDOM = parser.parseFromString(standardDOMString, "text/html").body.firstChild;

  function compareNodes(userNode, standardNode) {
    if (!userNode || !standardNode) return { matches: 0, total: 1 };

    let matches = 0;
    let total = 1;

    if (userNode.tagName === standardNode.tagName) matches++;

    const userAttributes = Array.from(userNode.attributes || []);
    const standardAttributes = Array.from(standardNode.attributes || []);
    total += Math.max(userAttributes.length, standardAttributes.length);

    const userAttrMap = Object.fromEntries(userAttributes.map(attr => [attr.name, attr.value.trim()]));
    const standardAttrMap = Object.fromEntries(standardAttributes.map(attr => [attr.name, attr.value.trim()]));

    for (const name in standardAttrMap) {
      if (userAttrMap[name] === standardAttrMap[name]) matches++;
    }

    for (const name in userAttrMap) {
      if (!standardAttrMap[name]) total++;
    }

    const userChildren = Array.from(userNode.children || []);
    const standardChildren = Array.from(standardNode.children || []);
    const maxChildren = Math.max(userChildren.length, standardChildren.length);

    for (let i = 0; i < maxChildren; i++) {
      const childComparison = compareNodes(userChildren[i], standardChildren[i]);
      matches += childComparison.matches;
      total += childComparison.total;
    }

    return { matches, total };
  }

  const { matches, total } = compareNodes(userDOM, standardDOM);
  return ((matches / total) * 100).toFixed(2);
}


function calculateStyleMatchPercentage(userDOMString, standardDOMString) {
  const parser = new DOMParser();
  const userDoc = parser.parseFromString(userDOMString, "text/html");
  const standardDoc = parser.parseFromString(standardDOMString, "text/html");

  function extractAllStyleKeys(doc) {
    const elements = doc.querySelectorAll("*");
    const styleKeys = new Set();
    elements.forEach(el => {
      const styleStr = el.getAttribute("style") || "";
      styleStr.split(";").forEach(s => {
        const [key] = s.split(":").map(part => part.trim().toLowerCase());
        if (key) styleKeys.add(key);
      });
    });
    return styleKeys;
  }

  const standardStyleKeys = extractAllStyleKeys(standardDoc);
  const userStyleKeys = extractAllStyleKeys(userDoc);

  let matches = 0;
  const total = standardStyleKeys.size;

  standardStyleKeys.forEach(key => {
    if (userStyleKeys.has(key)) matches++;
  });

  return total > 0 ? ((matches / total) * 100).toFixed(2) : "0.00";
}

function compareTextContent(userDOMString, standardDOMString) {
  const parser = new DOMParser();
  const userDOM = parser.parseFromString(userDOMString, "text/html").body.firstChild;
  const standardDOM = parser.parseFromString(standardDOMString, "text/html").body.firstChild;

  function extractTextContent(node) {
    return node.textContent
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
      .replace(/\s+/g, " ");
  }

  const userText = extractTextContent(userDOM);
  const standardText = extractTextContent(standardDOM);

  const similarity = window.stringSimilarity.compareTwoStrings(userText, standardText);
  return (similarity * 100).toFixed(2);
}




// Component Name
const CodingExamInterface = () => {
  const editorRef = useRef(null);
  const codeMirrorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [value, setValue] = useState(0); // scoring placeholder
  const [finalScore, setFinalScore] = useState(null);
  const [qlanguage, setQLanguage] = useState('');
  //retrive test from state
   const location = useLocation();
  const { test,admissionNumber } = location.state || {};
   // just pick first coding question for now (can loop later)
  const codingQuestion = test?.questions?.[0] || {};
console.log("hiii"+admissionNumber)

// session management
const navigate=useNavigate();
useEffect(() => {
  
    if (!admissionNumber|| admissionNumber.trim() === "") {
      navigate("/logout");
    
  }
}, [admissionNumber, navigate]);

if (!test) {
    return <p>No test data provided.</p>;
  }


  


// dynamic question details
  const questionId = codingQuestion.id;
  const questionText = codingQuestion.question_text;
  const imageUrl = codingQuestion.image
    ? `data:image/png;base64,${codingQuestion.image}`
    : null;
  const templateFunction = codingQuestion.templateFunction || "";
  const question_answer = codingQuestion.question_answer || "";

  // countdown
  const [remainingSeconds] = useState(1800);

  const evaluateUserDOM = async () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    const standardDOMString = fetchStandardDOM();
    const userDOMString = getUserDOM();
    await new Promise(r => setTimeout(r, 200));

    const structureMatch = calculateDOMMatchPercentage(userDOMString, standardDOMString);
    const styleMatch = calculateStyleMatchPercentage(userDOMString, standardDOMString);
    const textContentMatch = compareTextContent(userDOMString, standardDOMString);

    const final = (
      structureMatch * 0.2 +
      styleMatch * 0.6 +
      textContentMatch * 0.2
    ).toFixed(2);

    setFinalScore(final);

    displayScoreResults({
      "Test Case 1 (DOM Matching)": Number(structureMatch),
      "Test Case 2 (Style Matching)": Number(styleMatch),
      "Test Case 3 (Content Matching)": Number(textContentMatch),
      "Final Weighted Score": Number(final),
    });

    if (loadingOverlay) loadingOverlay.style.display = "none";
  };

  // Bind button after render
  useEffect(() => {
    const btn = document.getElementById("compareButton");
    if (btn) btn.addEventListener("click", evaluateUserDOM);
    return () => btn && btn.removeEventListener("click", evaluateUserDOM);
  }, []);




  // Initialize CodeMirror + restrictions + load saved code
  useEffect(() => {
    if (window.CodeMirror && editorRef.current && !codeMirrorRef.current) {
      codeMirrorRef.current = window.CodeMirror.fromTextArea(editorRef.current, {
        lineNumbers: true,
        mode: "javascript",
        theme: "default",
        viewportMargin: Infinity,
      });
      codeMirrorRef.current.setSize("100%", "100%");

      // Restore from localStorage
      const savedCode = localStorage.getItem("userCode");
      if (savedCode) codeMirrorRef.current.setValue(savedCode);

      // Save on change
      codeMirrorRef.current.on("change", (cm) => {
        localStorage.setItem("userCode", cm.getValue());
      });
    }

    // Disable copy/paste/cheating
    const blockActions = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        alert(`Keyboard shortcut for ${e.key.toUpperCase()} is disabled!`);
      }
    };
    document.addEventListener("keydown", blockActions);

    return () => {
      document.removeEventListener("keydown", blockActions);
    };
  }, []);

  // Compile React code
  const compileAndTest = async () => {
    if (!codeMirrorRef.current) return;
    const code = codeMirrorRef.current.getValue();
    const language = document.getElementById("language").value;
const outputDiv = document.getElementById("output");
    setLoading(true);
    try {
      if (language === "react") {
        try {
          const compiledCode = window.Babel.transform(code, { presets: ["react"] }).code;

          // Clear output
          //const outputDiv = document.getElementById("output");
          outputDiv.innerHTML = "";

          // Remove old script
          const existingScript = document.getElementById("compiledScript");
          if (existingScript) existingScript.remove();

          // Inject new script
          const scriptTag = document.createElement("script");
          scriptTag.type = "text/javascript";
          scriptTag.id = "compiledScript";
          scriptTag.text = `(function() {
            try {
              ${compiledCode}
              ReactDOM.render(
                React.createElement(App),
                document.getElementById('output')
              );
            } catch (error) {
              document.getElementById('output').innerHTML = 'Runtime error: ' + error.message;
              console.error('Runtime error:', error);
            }
          })();`;
          document.body.appendChild(scriptTag);

          setOutput("React code compiled and executed successfully.");
        } catch (err) {
          console.error("Compilation error:", err);
          setOutput("Errors are: " + err.message);
        }
      }
       else if (language === 'html') {
              
                try {
                    // Reset output
                    console.log("inside html compiler");
                    if (outputDiv && ReactDOM.findDOMNode(outputDiv)) {
                        try {
                            ReactDOM.unmountComponentAtNode(outputDiv);
                        } catch (unmountError) {
                            console.warn("Unmount error:", unmountError);
                        }
                    }

                    outputDiv.innerHTML = ''; // Clear previous content

                    // Directly inject the HTML into the outputDiv
                    outputDiv.innerHTML = code;

                    console.log("HTML code injected successfully.");
                } catch (error) {
                    console.error("HTML rendering error:", error);
                    outputDiv.innerHTML = "HTML Error: " + error.message;
                } finally {
                    loadingOverlay.style.display = "none";
                }
            
            
            }
      
      else {
        // Other languages - send to backend
        const data = new URLSearchParams();
        data.append("code", code);
        data.append("questionId", questionId);
        data.append("admissionNumber", admissionNumber);

        const response = await fetch(`/compile?language=${language}`, {
          method: "POST",
          body: data,
        });
        const result = await response.text();
        setOutput(result);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save user code
  const saveUserCode = async () => {
    if (!codeMirrorRef.current) return;
    const code = codeMirrorRef.current.getValue();

    const confirmed = window.confirm("Are you sure you want to submit your code?");
    if (!confirmed) return;

    const data = new URLSearchParams();
    data.append("code", code);
    data.append("questionId", questionId);
    data.append("admissionNumber", admissionNumber);
    data.append("testId",testId);
    data.append("status", "submitted");
    data.append("result", value);

    try {
      setLoading(true);
      const res = await fetch("/submitCode", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
        credentials: "same-origin",
      });

      if (!res.ok) throw new Error("Code submission failed");
      const msg = await res.text();
      alert(msg);

      localStorage.removeItem("userCode");
      window.location.href = `/codeSubmissionRedirect?admissionNumber=${encodeURIComponent(admissionNumber)}`;
    } catch (err) {
      console.error(err);
      alert("Code submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("/logout", { method: "GET", credentials: "same-origin" });
      if (res.status === 200) {
        window.location.href = "/logout";
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
   <div className="exam-interface">
      {/* Loading Overlay */}
      {loading && (
        <div id="loadingOverlay" className="loading-overlay">
          <div className="spinner"></div>
          <p>processing...</p>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="user-info">
          <div className="info-item">
            <strong>User ID:</strong> <span>{admissionNumber}</span>
          </div>
          <div className="info-item">
            <strong>Test ID:</strong> <span>{test?.testId}</span>
          </div>
          <span id="time-left" data-seconds={remainingSeconds}></span>
            

        </div>
        <button id="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Split */}
      <main id="mainSplit">
        <div id="topSplit">
          {/* Question Panel */}
          <div id="questionPanel" className="panel">
            <p>
              {questionId} : {questionText}
            </p>
            {imageUrl && (
              <img id="questionImage" src={imageUrl} alt="Question" />
            )}
          </div>

          {/* Editor Panel */}
          <div id="editorPanel" className="panel">
            <div className="editor-toolbar">
           <select id="language" value={codingQuestion.language} readOnly>
  {codingQuestion.language && (
    <option value={codingQuestion.language}>
      {codingQuestion.language.charAt(0).toUpperCase() + codingQuestion.language.slice(1)}
    </option>
  )}
</select>

              <div className="button-bar">
                <button id="compile" onClick={compileAndTest}>
                  Compile
                </button>
                <button id="saveCode" onClick={saveUserCode}>
                  Submit
                </button>
                <button id="compareButton">Run Tests</button>
              </div>
            </div>
            {/* hidden standard answer */}
            <span
              id="answer-holder"
              data-answer={question_answer}
              style={{ display: "none" }}
            ></span>
            <div className="code-wrapper">
              <textarea
                id="code"
                ref={editorRef}
                defaultValue={templateFunction}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div id="outputPanel" className="panel">
          <div className="output-flex">
            <div id="output" className="output"></div>
            <div id="matchResultContainer" className="result-box">
              Final Result Will Show Here
            </div>
          </div>
          {output && <pre className="compile-output">{output}</pre>}
        </div>
      </main>

      <div id="loadingOverlay">
        <div className="spinner"></div>
      </div>
      <div id="matchResultContainer"></div>
      {finalScore && <p>Final Score: {finalScore}%</p>}
    </div>);
};

export default CodingExamInterface;
