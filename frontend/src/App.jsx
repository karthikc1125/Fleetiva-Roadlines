import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">🚀 Setup Complete!</h1>
        <p className="text-gray-700">
          If you see this, the Frontend is connected to the Context.<br/>
          You are ready to submit your PR.
        </p>
      </div>
    </div>
  )
}

export default App;