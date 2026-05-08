const fetchData = (messageData) => {
     
    // messageFrom=req.body['data']['from'] // sender number
    const messageMsg = req.body['data']['body']; // Message text
   

    res.status(200).end();

    // Return the messageMsg value
    return messageMsg;
};

// Export the fetchData function and messageMsg variable
export { fetchData, messageMsg };
