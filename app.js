// Main App Component
const App = () => {
  const [expression, setExpression] = React.useState('');
  const [lowerBound, setLowerBound] = React.useState('');
  const [upperBound, setUpperBound] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);

  // Handle form submission
  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    
    if (!expression.trim()) {
      setError('Please enter a mathematical expression');
      return;
    }
    
    try {
      // Calculate indefinite integral using nerdamer
      const indefiniteResult = nerdamer.integrate(expression, 'x').text();
      
      let definiteResult = null;
      
      // Calculate definite integral if bounds are provided
      if (lowerBound.trim() && upperBound.trim()) {
        try {
          definiteResult = nerdamer.integrate(expression, 'x', lowerBound, upperBound).text();
        } catch (boundError) {
          setError(`Error with bounds: ${boundError.message}`);
        }
      }
      
      // Set result
      setResult({
        indefinite: indefiniteResult,
        definite: definiteResult
      });
      
      // Show result with animation
      setShowResult(false);
      setTimeout(() => setShowResult(true), 50);
      
    } catch (err) {
      setError(`Error calculating integral: ${err.message}`);
      setResult(null);
    }
  };
  
  // Clear all inputs
  const handleClear = () => {
    setExpression('');
    setLowerBound('');
    setUpperBound('');
    setResult(null);
    setError('');
    setShowResult(false);
  };
  
  // Format expression for KaTeX display
  const formatForKaTeX = (expr) => {
    return expr
      .replace(/\^/g, '^')
      .replace(/\*/g, '\\cdot ')
      .replace(/pi/g, '\\pi ')
      .replace(/infinity/g, '\\infty ')
      .replace(/sin/g, '\\sin')
      .replace(/cos/g, '\\cos')
      .replace(/tan/g, '\\tan')
      .replace(/log/g, '\\log')
      .replace(/ln/g, '\\ln')
      .replace(/exp/g, 'e^');
  };
  
  // Render math using KaTeX
  const renderMath = (expr) => {
    try {
      const formattedExpr = formatForKaTeX(expr);
      return <div dangerouslySetInnerHTML={{ 
        __html: katex.renderToString(formattedExpr, { displayMode: true }) 
      }} />;
    } catch (err) {
      return <div className="error">Error rendering expression</div>;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Neon Integral Calculator</h1>
        <p className="subtitle">Calculate indefinite and definite integrals</p>
      </header>
      
      <div className="calculator">
        <form onSubmit={handleCalculate}>
          <div className="input-section">
            <div className="input-group">
              <label htmlFor="expression">Enter a function f(x):</label>
              <input
                type="text"
                id="expression"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="e.g., x^2 + sin(x)"
                autoComplete="off"
              />
            </div>
            
            <div className="bounds-container">
              <div className="input-group">
                <label htmlFor="lowerBound">Lower Bound (optional):</label>
                <input
                  type="text"
                  id="lowerBound"
                  value={lowerBound}
                  onChange={(e) => setLowerBound(e.target.value)}
                  placeholder="e.g., 0"
                  autoComplete="off"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="upperBound">Upper Bound (optional):</label>
                <input
                  type="text"
                  id="upperBound"
                  value={upperBound}
                  onChange={(e) => setUpperBound(e.target.value)}
                  placeholder="e.g., 1"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          
          <div className="button-group">
            <button type="submit" className="calculate-btn">
              Calculate Integral
              <div className="button-glow"></div>
            </button>
            <button type="button" className="clear-btn" onClick={handleClear}>
              Clear
              <div className="button-glow"></div>
            </button>
          </div>
        </form>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className={`result-section ${showResult ? 'show' : ''}`}>
            <h2 className="result-title">Integration Results</h2>
            
            <div className="math-display">
              <div className="math-label">Original Function:</div>
              {renderMath(`f(x) = ${expression}`)}
            </div>
            
            <div className="math-display">
              <div className="math-label">Indefinite Integral:</div>
              {renderMath(`\\int ${expression} \\, dx = ${result.indefinite} + C`)}
            </div>
            
            {result.definite && (
              <div className="math-display">
                <div className="math-label">Definite Integral:</div>
                {renderMath(`\\int_{${lowerBound}}^{${upperBound}} ${expression} \\, dx = ${result.definite}`)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Render the App
ReactDOM.createRoot(document.getElementById('root')).render(<App />);