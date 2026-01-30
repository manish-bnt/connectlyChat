import './App.css'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import ContactPage from './pages/ContactPage'
import SignupPage from './pages/SignupPage'
import OtpPage from './pages/OtpPage'
import LoginPage from './pages/LoginPage'
import { createContext, useRef, useState } from 'react'
import AuthPage from './comps/layout/AuthPage'
import AddContactPage from './pages/AddContactPage'
import { useEffect } from 'react'
import { getContactsAPI, getMe } from './comps/api/api'
import Spinner from './comps/Spinner'
import Layout from './comps/layout/Layout'
import ChatWindow from './comps/chats/ChatWindow'
import ProfilePage from './pages/ProfilePage'
import { io } from 'socket.io-client'
export const Usercontext = createContext()
function App() {

  const [logUser, setLogUser] = useState(null)
  const [contacts, setContacts] = useState([])
  console.log("contacts: ", contacts)
  const [messages, setMessages] = useState([])
  const [lastMsg, setLastMsg] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null);
  const [demoSessionId, setDemoSessionId] = useState(null);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false)
  const [initializing, setInitializing] = useState(true)

  const socketRef = useRef(null);

  useEffect(() => {
    if (!logUser) return

    // Generate demo session id (if demo user)
    let sessionId
    if (logUser.isDemo) {
      sessionId = localStorage.getItem("demoSessionId")
      if (!sessionId) {
        sessionId = crypto.randomUUID()
        localStorage.setItem("demoSessionId", sessionId)
      }
      setDemoSessionId(sessionId)
    }

    // Initialize socket
    socketRef.current = io(`${import.meta.env.VITE_API_URL}`, {
      query: { userId: logUser._id }
    })

    socketRef.current.on("connect", () => {
      // console.log("Socket connected:", socketRef.current.id)
    })

    // Join demo session room if demo user
    if (logUser.isDemo && sessionId) {
      socketRef.current.emit("joinDemoSession", sessionId)
    }

    socketRef.current.on("disconnect", () => {
      // console.log("Socket disconnected")
    })

    // Listen for contact restored
    socketRef.current.on("contactRestored", (contact) => {
      setContacts(prev => {
        const exists = prev.find(c => c._id === contact._id)
        if (exists) return prev
        return [contact, ...prev]
      })
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [logUser]) // dependency only logUser



  // Fetching User Details during login process
  async function fetchUserDetails() {
    const token = localStorage.getItem('loggedToken');
    if (token) {
      try {
        const { response, data } = await getMe(token)
        if (response.status === 401) {
          localStorage.removeItem("loggedToken")
          setLogUser(null)
          return
        }

        setLogUser(data.data)

      } catch (error) {
        console.error("Session verification failed:", error.message);
      }

    }
    setInitializing(false)
  }
  useEffect(() => {
    fetchUserDetails()
  }, [])


  // Fetching contacts

  async function fetchContacts() {
    try {
      const token = localStorage.getItem('loggedToken');
      if (logUser && token) { // only fetching when user logged in.
        setIsFetchingContacts(true)
        const { response, data } = await getContactsAPI(token)
        // console.log("Dataaa: ", data.data)
        if (response.ok) {
          setContacts(data.data)
        }
      }
    } catch (error) {
      console.error("Fetch error: ", error.message)
    } finally {
      setIsFetchingContacts(false)
    }

  }
  useEffect(() => {
    fetchContacts()
  }, [logUser])



  if (initializing) return <Spinner />
  if (isFetchingContacts) return <Spinner />

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Layout />
        </>
      ),
      children: [
        {
          index: true,
          element: (
            <AuthPage>
              <ContactPage />
            </AuthPage>
          ),
        },
        {
          path: 'contacts',
          element: (
            <AuthPage>
              <ContactPage />
            </AuthPage>
          ),
          children: [
            {
              path: ':id',
              element: <ChatWindow />
            }
          ]
        },
        {
          path: 'add-contact',
          element: (
            <AuthPage>
              <AddContactPage />
            </AuthPage>
          )
        },
        {
          path: 'my-profile',
          element: (
            // <AuthPage>
            //   </AuthPage>
            <ProfilePage />
          )
        },
        {
          path: 'signup',
          element: <SignupPage />
        },
        {
          path: 'otp-verify',
          element: <OtpPage />,
        },
        {
          path: 'login',
          element: <LoginPage />,
        },
      ]
    }
  ])

  return (
    <>
      <Usercontext.Provider value={{
        logUser,
        setLogUser,
        initializing,
        setInitializing,
        contacts,
        setContacts,
        socketRef,
        messages,
        setMessages,
        lastMsg,
        setLastMsg,
        demoSessionId,
        fetchUserDetails,
        fetchContacts,
        selectedUser,
        setSelectedUser
      }}>
        <RouterProvider router={router} />
      </Usercontext.Provider>
    </>
  )
}

export default App
