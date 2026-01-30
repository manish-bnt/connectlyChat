export function properCase(text) {
  if (!text) return

  const formatedText = text.split(" ").map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join(" ")

  return formatedText
}

export function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};



// properCase("my name is manish")