import { faMessage, faPaperPlane, faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatInput({ friend, handleSend, textState }) {
  // textState contains { text, setText }
  // Used to control the textarea value

  return (
    <>
      {/* Chat Input Form at the bottom */}
      <form onSubmit={handleSend} className="w-full px-2 py-2 flex gap-2">
        <textarea
          type="text"
          placeholder="Type a message"
          disabled={friend?.linkedUser?.isDeleted} // Disable input if the contact deleted their account
          value={textState.text}
          rows={1} // Start with 1 row
          onChange={(e) => textState.setText(e.target.value)} // Update text state
          onKeyDown={(e) => {
            // If Enter is pressed without Shift, send the message
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
              e.target.style.height = "auto"; // Reset height after sending
            }
          }}
          className={`
            w-full p-3 max-h-[150px] shadow-lg overflow-y-auto resize-none rounded-3xl
            ${friend?.linkedUser?.isDeleted
              ? "bg-gray-200 text-black font-bold cursor-not-allowed" // Disabled style
              : "bg-white"} // Normal style
            focus:outline-none pl-6 pr-12 border border-slate-200
          `}
        />

        <button onClick={handleSend} className="bg-emerald-400 h-12 w-12 rounded-full flex items-center justify-center flex-none"><FontAwesomeIcon className="text-white" icon={faPaperPlane} /> </button>
      </form>
    </>
  )
}






