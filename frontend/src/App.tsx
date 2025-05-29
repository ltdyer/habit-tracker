import { ReminderDisplayRTKQ } from './components/rtkQuery/ReminderDisplayRTKQ.tsx'
import { ReminderDisplay } from './components/baseRedux/ReminderDisplay.tsx'
import './App.css'
import { ToastContainer } from 'react-tiny-toast'

function App() {
  
  return (
    <>
      <ToastContainer />
      <ReminderDisplayRTKQ />
    </>
  )
}

export default App
