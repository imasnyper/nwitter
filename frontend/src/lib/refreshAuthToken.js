
export default async function refreshAuthToken(username, refreshToken) {
    const response = await fetch("http://localhost:8000/refresh-api-token/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
            "username": username,
            "refresh_token": refreshToken
        })
    })
    .then(response => response.json())
    .then(data => {
        return data
    })

    return response    
}