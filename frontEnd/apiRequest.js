const apiRequest = async (endPoint,method,token,data)=>{
   const response = await fetch(endPoint,{
        method: method,
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'CSRF-Token':`${token}`,
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
    });

    const body = await response.json();
    
    return{
        ok: response.ok,
        status: response.status,
        body: body
    }
}

export default apiRequest;