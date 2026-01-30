export async function signupAPI(formData) {
  // Placeholder for signup API call
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/signup`;
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    let data = await res.json()

    return { response: res, data: data };

  } catch (error) {
    console.error("Error during signup API call:", error.message);
    return { response: { ok: false }, data: { msg: "Network error" } };
  }
}

export async function resendOtpAPI({ email }) {
  // Placeholder for resend OTP API call
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/resend-otp`;
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    let data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("Error during resend OTP API call:", error.message);
    return { response: { ok: false }, data: { msg: "Network error" } }
  }
}

export async function verifyOtpAPI({ email, OTP }) {
  // Placeholder for verify OTP API call
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/otp-verify`;
    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ email, OTP })
    })

    let data = await res.json()

    return { response: res, data: data }
  } catch (error) {
    console.error("Error during verify OTP API call:", error.message);
    return { response: { ok: false }, data: { msg: "Network error" } };
  }
}

export async function loginAPI(formData) {
  // Placeholder for loginAPI call

  try {
    const url = `${import.meta.env.VITE_API_URL}auth/login`

    let res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    })

    let data = await res.json()

    return { response: res, data: data }
  } catch (error) {
    console.error("Error during login API call:", error.message);
    return { response: { ok: false }, data: { msg: 'Network error' } };
  }
}

export async function getMe(loggedToken) {
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/getMe`

    let res = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${loggedToken}` }
    })

    let data = await res.json()

    return { response: res, data: data }

  } catch (error) {
    console.error('Error during fetching user info: ', error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function addContactAPI(contact, loggedToken) {
  try {
    const url = `${import.meta.env.VITE_API_URL}contact/add-contact`

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${loggedToken}`
      },
      body: JSON.stringify(contact)
    })

    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("Error during add contact API call: ", error.message);
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}


export async function getContactsAPI(loggedToken) {
  try {
    const url = `${import.meta.env.VITE_API_URL}contact/all-contacts`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${loggedToken}` },
    })

    const data = await res.json()

    return { response: res, data: data }
  } catch (error) {
    console.error("Error during fetching contacts: ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function uploadProfileAPI(loggedToken, formData) {
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/upload-profile`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${loggedToken}` },
      body: formData
    })

    const data = await res.json()

    return { response: res, data: data }
  } catch (error) {
    console.error("Failed to upload image: ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function deleteProfileAPI(loggedToken) {
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/delete-profile`

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${loggedToken}` }
    })

    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("profile deletion request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function updateProfileAPI(loggedToken, updatedInfo) {
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/update-profile`

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${loggedToken}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedInfo)
    })

    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("profile updation request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function deleteAccountAPI(loggedToken) {
  try {
    const url = `${import.meta.env.VITE_API_URL}auth/delete-account`

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loggedToken}`,
        'Content-type': 'application/json'
      },
    })

    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("Account deletion request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function updateContactAPI(loggedToken, updatedContact) {
  try {
    const url = `${import.meta.env.VITE_API_URL}contact/update-contact/${updatedContact._id}`

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${loggedToken}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedContact)
    })

    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("contact updation request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function deleteContactAPI(loggedToken, selectedContact) {
  try {
    const url = `${import.meta.env.VITE_API_URL}contact/delete-contact/${selectedContact._id}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loggedToken}`,
        'Content-type': 'application/json'
      },
      // body: JSON.stringify(updatedContact)
    })
    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("contact deletion request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}

export async function deleteChatsAPI(loggedToken, friendId) {
  try {
    const url = `${import.meta.env.VITE_API_URL}chat/delete-chats/${friendId}`
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${loggedToken}`,
        'Content-type': 'application/json'
      },
      // body: JSON.stringify(updatedContact)
    })
    const data = await res.json()
    return { response: res, data: data }
  } catch (error) {
    console.error("Chats deletion request failed ", error.message)
    return { response: { ok: false }, data: { msg: 'Network error' } }
  }
}