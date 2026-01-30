import { useOutletContext } from 'react-router-dom'
import { properCase } from '../../utility/utility'
import { useContext, useEffect, useState } from 'react'
import { Usercontext } from '../../App'
import { getMessageAPI, sendMessageAPI } from '../api/msgApi'
import PopupMsg from '../PopupMsg'
import Spinner from '../Spinner'
import ChatHeader from './ChatHeader'
import ChatArea from './ChatArea'
import ChatInput from './ChatInput'
import ContactDetail from '../contacts/ContactDetail'
import EditContactInfo from '../contacts/EditContactInfo'
import useAutoClearMessage from '../../customHooks/useAutoClearMessage'

export default function ChatWindow() {
  const friend = useOutletContext()
  const { logUser, socketRef, messages, setSelectedUser, setMessages, setLastMsg } = useContext(Usercontext)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [panel, setPanel] = useState("none")

  // Auto-clear error messages after 3 seconds
  useAutoClearMessage(errorMessage, setErrorMessage, 3000)


  useEffect(() => {
    return () => {
      setSelectedUser(null);
    }
  }, [setSelectedUser])

  // Fetch messages for selected friend
  const demoSessionId = localStorage.getItem("demoSessionId");
  useEffect(() => {
    if (!friend?._id) return

    if (friend.linkedUser?.isDeleted) {
      setErrorMessage({ type: 'error', text: 'This user has deleted their account' })
    }

    async function fetchChat() {
      setLoading(true)
      try {
        const token = localStorage.getItem('loggedToken');
        const demoSessionId = localStorage.getItem('demoSessionId'); // include demoSessionId for demo user

        const { data } = await getMessageAPI(token, friend.linkedUser._id, demoSessionId)
        // console.log("emssage data", data)
        setMessages(data.data)
        setLastMsg(data.data[data.data.length - 1])
      } catch (error) {
        setErrorMessage({ type: 'error', text: 'Failed to fetch chat' })
      } finally {
        setLoading(false)
      }
    }

    fetchChat()
  }, [friend?._id, demoSessionId])

  // Listen for incoming chat messages

  useEffect(() => {
    if (!socketRef.current) return

    const handleIncoming = (incomingMsg) => {
      // only messages for this friend and session
      if (
        (incomingMsg.sender === friend?.linkedUser?._id && incomingMsg.receiver === logUser._id) ||
        (incomingMsg.receiver === friend?.linkedUser?._id && incomingMsg.sender === logUser._id)
      ) {
        setMessages(prev => [...prev, incomingMsg])
        setLastMsg(incomingMsg)
      }
    }

    socketRef.current.on("chatMessage", handleIncoming)
    return () => socketRef.current.off("chatMessage", handleIncoming)
  }, [friend?._id, logUser?._id])


  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    const token = localStorage.getItem('loggedToken')
    const demoSessionId = localStorage.getItem("demoSessionId")
    const { data } = await sendMessageAPI(token, friend.linkedUser?._id, text, demoSessionId)

    // Add sent message to global messages
    setMessages(prev => [...prev, data.data])

    // Emit message via socket to friend
    socketRef.current.emit('chatMessage', {
      senderId: logUser._id,
      receiverId: friend.linkedUser._id,
      text: text,
      demoSessionId: logUser.isDemo ? localStorage.getItem("demoSessionId") : undefined
    })

    setText("")
  }

  if (loading) return <Spinner />

  return (
    <div className="w-full h-full bg-yellow-400 fixed inset-0 md:static md:inset-auto overflow-hidden">

      <div className={`bg-red-200 relative w-full h-full`}>

        {/* Chat Area */}
        <div className={`h-full w-full bg-emerald-50 flex flex-col `}>

          < PopupMsg message={errorMessage} />

          <div className='bg-slate-50 border-b-[0.1px] border-gray-200' onClick={() => setPanel("contact")}>
            <ChatHeader friend={friend} />
          </div>

          <ChatArea messages={messages} />

          <ChatInput friend={friend} handleSend={handleSend} textState={{ text, setText }} />

        </div>


        {/* Right-side Panel */}
        <div className={`absolute top-0 left-0 w-full h-full overflow-hidden z-50 transition-transform duration-300 ease-in-out
          ${panel === "none" ? "translate-x-full" : "translate-x-0"}`}>

          {/* Contact Detail */}
          <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out ${panel === "contact" ? "translate-x-0" : "translate-x-full"}`}>
            <ContactDetail friend={friend} setPanel={setPanel} msg={{ messages, setMessages }} />
          </div>

          {/* Edit Contact Info */}
          <div className={`absolute inset-0 bg-gray-50 transition-transform duration-300 ${panel === "editContact" ? "translate-x-0" : "translate-x-full"}`}>
            <EditContactInfo setPanel={setPanel} friend={friend} />
          </div>

        </div>

      </div>
    </div >
  )
}
