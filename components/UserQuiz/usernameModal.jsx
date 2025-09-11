export default function UsernameModal(props) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/quizCreation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const newPostData = await response.json();
    console.log("Quiz submission response:", newPostData);
  };
 
  return (
    <div  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h1 className="text-xl font-bold text-center mb-5">Sign Up</h1>
        <p className="text-center text-gray-600">This will be your quiz identity. Choose wisely, you can't change it later</p>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username" className="text-gray-500">Username</label>
        </div>
        <div>
            <input type="text" name="username" id="username" className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mt-5">
            <label htmlFor="username" className="text-gray-500">Password</label>
        </div>
        <div>
            <input type="pasword" name="username" id="username" className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="mt-5">
            <button type="submit" className="rounded-md bg-blue-900 p-4 text-white text-md">Continue</button> <button type="button" onClick={props.onClose} className="rounded-md  p-4 text-blue-900 text-md border border-gray-400">Cancel</button>
        </div>
        </form>
        </div>
        
        
      
    </div>
  );
}
