import React from 'react';

export default function ManageQuestions() {
  // Sample data based on the provided image
  const questions = [
    {
      id: 1,
      questionText: `<section><h1>React Assignment: Create a Student ICARD Component</h1><p>You are provided with a basic <code>App</code> component template. Your task is to create a <strong>Student ICARD</strong> using React inside the <code>App</code> component. You can create additional child components if needed, but <strong>make sure to call them inside the <code>App</code> component only</strong>.</p><h2>Requirements:</h2><ul><li>Design the ICARD to display the student's photo and information clearly and in a readable format.</li><li>The data to display (in order) is:</li><ul><li><code>College Name: ABES Engineering College Roll: 56565656 Name: Rahul Kumar Branch: CSE Section: A</code></li><li>Use <strong>inline styles</strong> for all styling.</li></ul><li>Your solution will be evaluated on:</li><ul><li>Correct and semantic DOM structure</li><li>Proper use of inline styles to match the design layout</li><li>Correct content and sequence as shown above</li></ul><h2>Additional Notes:</h2><ul><li>You may create separate React components, but those components must be invoked inside the <code>App</code> component.</li><li>The photo of the student should be included in the card (you can use any placeholder image URL).</li><li>Follow the layout and styling as per the reference image (provided separately).</li><li>Your code will be tested with automated test cases checking the DOM structure, styles, and content accuracy.</li><li>Weightage of test cases may vary.</li></ul></section>`,
      answer: `<div id="output" class="output" style="flex: 3 1 0%;"><div style="margin-left: 300px;"><div style="height: 250px; width: 200px; border: 2px solid red; background-color: blanchedalmond;"><d>B</d><d>D</d><table><tbody><tr><td colspan="2">ABES Engineering College</td></tr><tr><td colspan="2"><img src="https://img.freepik.com/free-photo/lifestyle-business-people-using-laptop-computer-pink_1150-15549.jpg?t=1749050525-exp=1749054125-hmac=674e87b20b0772700780e68e5ab23fddbb7de553cefa9b496e25a2da8e22b63e&amp;w=1480" height="100" width="100" alt="student pic"></td></tr><tr><td>Roll</td><td>56565656</td></tr><tr><td>Name</td><td>Rahul Kumar</td></tr><tr><td>Branch</td><td>CSE AIML</td></tr></tbody></table></div></div></div>`,
      level: 'medium',
    },
    {
      id: 2,
      questionText: `<section><h1>Create a Tabbed Dashboard Interface in React</h1><p>You are building a Dashboard interface for a web application using React. Your task is to design a tabbed layout that allows users to switch between three different views: <code>Home</code>, <code>Profile</code>, and <code>Settings</code>. The layout must be visually clear and responsive, using JSX and CSS styling, and it should rely on React state (<code>useState</code>) to handle tab switching.</p><h2>Requirements:</h2><ul><li>Each tab must render a different component or section of the UI.</li><ul><li><code>Home</code> tab should show a welcome message and a summary box.</li><li><code>Profile</code> tab should show user information like name, email, and role.</li><li><code>Settings</code> tab should display toggle switches for notifications and theme selection (they don't need to be functional).</li></ul><li>The tab switching should be smooth and visually appealing.</li><li>Use <strong>inline styles</strong> for all styling.</li></ul><h2>Additional Notes:</h2><ul><li>You may create separate React components for each tab's content, but they must be invoked within the main Dashboard component.</li><li>Follow the layout and styling as per the reference image (provided separately).</li><li>Your code will be tested with automated test cases checking the DOM structure, styles, and content accuracy.</li><li>Weightage of test cases may vary.</li></ul></section>`,
      answer: `<div id="output" class="output" style="background-color: rgb(255, 255, 255); padding: 30px; width: 700px; margin: 30px auto; border-radius: 12px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; font-family: Arial, sans-serif;"><h1 style="padding: 10px 20px; border: none; background-color: rgb(0, 123, 255); color: white; border-radius: 6px; font-size: 16px;">React Tabbed Dashboard</h1><div style="display: flex; gap: 10px; margin-bottom: 20px;"><button style="padding: 10px 20px; border: none; background-color: rgb(224, 224, 224); border-radius: 6px; font-size: 16px;">Home</button><button style="padding: 10px 20px; border: none; background-color: rgb(224, 224, 224); border-radius: 6px; font-size: 16px;">Profile</button><button style="padding: 10px 20px; border: none; background-color: rgb(224, 224, 224); border-radius: 6px; font-size: 16px;">Settings</button></div><div style="background-color: rgb(249, 249, 249); padding: 20px; border-radius: 10px;"><h2 style="font-size: 24px; margin-bottom: 10px;">Welcome to Your Dashboard</h2><p>This is your summary page.</p></div></div>`,
      level: 'medium',
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen  border-2 border-gray-200  rounded-2xl ">
        <h1 className="text-2xl font-bold mb-6 text-[#235a81]">Manage Questions</h1>

      <div className="overflow-x-auto shadow-md border border-gray-200">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-[#235a81] text-white text-left">
              <th className="py-3 px-4 border-b border-gray-300 w-[8%]">Question ID</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[35%]">Question Text</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[35%]">Answer</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[10%]">Level</th>
              <th className="py-3 px-4 border-b border-gray-300 w-[12%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4 align-top">{question.id}</td>
                <td className="py-3 px-4 align-centre text-sm max-w-xs ">{question.questionText}</td>
                <td className="py-3 px-4 align-centre text-sm max-w-xs max-h-fit overflow-x-scroll "><div className=''>{question.answer}</div></td>
                <td className="py-3 px-4 align-top">{question.level}</td>
                <td className="py-3 px-4 align-top flex flex-col sm:flex-row gap-2">
                  <button className="bg-[#235a81] opacity-95 hover:opacity-100 text-white font-bold py-2 px-4 rounded text-sm">
                    Edit
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
