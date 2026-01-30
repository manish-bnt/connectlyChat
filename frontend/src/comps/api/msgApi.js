export async function sendMessageAPI(loggedToken, receiverId, text, demoSessionId) {
  try {

    const url = `${import.meta.env.VITE_API_URL}chat/message/send`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${loggedToken}`
      },
      body: JSON.stringify({ receiverId, text, demoSessionId })
    })

    const data = await res.json()

    return { respose: res, data: data }

  } catch (error) {
    console.error('Error during sending message: ', error.message)

    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function getMessageAPI(loggedToken, contactUserId) {
  // console.log("contact user id msgapi ", contactUserId)
  try {
    const url = `${import.meta.env.VITE_API_URL}chat/message/${contactUserId}`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${loggedToken}`
      }
    })

    const data = await res.json()
    // console.log("data msg api ", data)
    return { response: res, data: data }
  } catch (error) {
    console.error('Error during fetching chats: ', error.message)
    return { response: { ok: false }, data: { message: 'Network error' } }
  }
}
